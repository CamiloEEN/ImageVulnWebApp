import os
from fastapi import FastAPI, Depends, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from fastapi.responses import JSONResponse
#from uuid import uuid4
from datetime import datetime

#################### to test the db connection
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import SessionLocal
from . import crud

from fastapi.staticfiles import StaticFiles

import app.modTanhCEEN as sfunc
from app import models

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
########################################################

app = FastAPI()

# Intento de corregir el problema de comunicaciòn con la DB
@app.on_event("startup")
def startup_event():
    print("🔧 Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized successfully!")

# Sirve la carpeta de imágenes editadas como archivos estáticos
app.mount("/edited_images", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static", "edited_images")), name="edited_images")


# Agrega esto para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173","http://localhost:5173"],  # o ["*"] para permitir todo (inseguro)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message":"backend is running"}

@app.post("/login")
async def login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    #Chequea si el usuario con ese email y contraseña existe
    user = crud.get_user_by_email(db, email)
    if user == None:
        return JSONResponse({"error":"Email incorrecto"}, status_code=401)
    
    
    #stored = crud.get_password_by_user_id(db, user["id"])
    #if stored == None or stored["password_hash"] != password:
        #return JSONResponse({"error":"Contraseña incorrecta"}, status_code=401)
    if crud.check_password(db, user["id"], password) == None:
        return JSONResponse({"error":"Contraseña incorrecta"}, status_code=401)
    
    # Crear cookie de sesión insegura (id del usuario)
    response = JSONResponse(content={"message":"Login exitoso", "user_id": user["id"]})
    response.set_cookie(
        key= "session_id",
        value=str(user["id"]),
        httponly=False, #Security risk
        samesite="Lax" #Security risk
    )

    return response
    
@app.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    user_id = request.cookies.get("session_id")

    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)
    
    user = crud.get_user_by_id(db, int(user_id))
    if not user:
        return JSONResponse({"error": "Usuario inválido"}, status_code=401)
    
    return user

@app.post("/logout")
def logout():
    response = JSONResponse({"message": "Sesión cerrada"})
    response.delete_cookie("session_id")
    return response   

@app.post("/register")
async def register_user(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    nickname = data.get("nickname")
    username = data.get("username")
    usersurname = data.get("usersurname")
    email = data.get("email")
    password_hash = data.get("password")

    # Chequea si ya existe
    existing = crud.get_user_by_email(db, email)
    if existing:
        return {"error": "Ya existe un usuario con ese email"}

    # 1. Crear usuario
    new_user = crud.create_user(db, nickname, username, usersurname, email)
    if not new_user:
        return {"error": "No se pudo crear el usuario"}

    # 2. Guardar contraseña en texto plano (por ahora)
    crud.create_password(db, new_user["id"], password_hash)

    return crud.get_user_by_id(db, new_user["id"])


@app.post("/change-password")
async def change_password(request: Request, db: Session = Depends(get_db)):
    # Verifica que el usuario está autenticado
    user_id = request.cookies.get("session_id")
    #print("fue solicitado un cambio de contraseña")

    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)
    
    
    #obtiene la información para cambiar contraseña
    data = await request.json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    stored = crud.get_password_by_user_id(db, user_id)

    if current_password != stored["password_hash"] or stored["password_hash"] == None:
        return JSONResponse({"error": "Contraseña actual incorrecta"}, status_code=403)
    
    if current_password == new_password:
        return JSONResponse({"error":"La nueva contraseña debe ser diferente a la actual"}, status_code=403)
    
    crud.update_password(db, user_id, new_password)
    return JSONResponse({"message":"Contraseña creada con éxito!"})

@app.post("/edit-profile")
async def edit_profile(request: Request, db: Session = Depends(get_db)):
    # Verifica que el usuario está autenticado
    user_id = request.cookies.get("session_id")
    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)
    
    data = await request.json()
    nickname = data.get("new_nickname")
    username = data.get("new_username")
    usersurname = data.get("new_usersurname")
    email = data.get("new_email")

    crud.update_user(db, user_id, nickname, username, usersurname, email)
    return JSONResponse({"message":"Perfil actualizado con éxito!"})
# ================== ENDPOINTS PARA EXPLORE ===================

@app.get("/explore/posts")
def get_all_posts_endpoint(request: Request, db: Session = Depends(get_db)):
    posts = crud.get_all_posts(db)

    # Adjuntar el nombre de la imagen desde la tabla images
    for post in posts:
        image = crud.get_image_by_id(db, post["image_id"])
        post["image_filename"] = image["filename"] if image else None
    return posts

@app.get("/explore/comments/")
def get_comments(post_id: int, db: Session = Depends(get_db)):
    return crud.get_comments_by_post_id(db, post_id)

@app.post("/explore/comments/")
async def post_comment(request: Request, db: Session = Depends(get_db)):
    user_id = request.cookies.get("session_id")
    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)

    data = await request.json()
    post_id = data.get("post_id")
    content = data.get("content")

    if not post_id or not content:
        return JSONResponse({"error": "Faltan campos obligatorios"}, status_code=400)

    comment = crud.create_comment(db, post_id, int(user_id), content)
    return comment

@app.get("/explore/likes/count/")
def count_likes(post_id: int, db: Session = Depends(get_db)):
    count = crud.count_likes_by_post_id(db, post_id)
    return {"count": count}

@app.post("/explore/likes/")
async def like_post(request: Request, db: Session = Depends(get_db)):
    user_id = request.cookies.get("session_id")
    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)

    data = await request.json()
    post_id = data.get("post_id")

    if not post_id:
        return JSONResponse({"error": "Falta post_id"}, status_code=400)

    existing = crud.get_like_by_user_and_post(db, int(user_id), post_id)
    if existing:
        return JSONResponse({"error": "Ya le diste like"}, status_code=400)

    return crud.create_like(db, post_id, int(user_id))

@app.delete("/explore/likes/")
async def unlike_post(request: Request, db: Session = Depends(get_db)):
    user_id = request.cookies.get("session_id")
    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)

    data = await request.json()
    post_id = data.get("post_id")

    if not post_id:
        return JSONResponse({"error": "Falta post_id"}, status_code=400)

    crud.delete_like(db, int(user_id), post_id)
    return {"message": "Like eliminado"}


# ================== ENDPOINTS PARA EDITOR ===================

@app.post("/upload_edited_image")
async def upload_edited_image(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):

    # Verifica que el usuario está autenticado
    user_id = request.cookies.get("session_id")
    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)
    
    # Leer contenido de la imagen
    contents = await file.read()

    # Crear nombre del archivo: user_id_YYYYMMDD_HHMMSS.png
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{user_id}_{timestamp}.png"
    
    filepath = os.path.join(os.path.dirname(__file__), "static", "edited_images", filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    # Registrar en la base de datos
    image = crud.create_image(
    db=db,
    user_id=int(user_id),
    filename=filename,
    mime_type=file.content_type,
    size=len(contents)
    )

    return {
        "message": "Imagen guardada exitosamente",
        "image_url": f"/edited_images/{filename}",
        "image_id": image["id"]
    }


@app.post("/transform")
async def transform(request: Request):

    data = await request.json()

    print(data['red']['q0'])
    # red transform
    q0 = data['red']['q0']
    p1 = data['red']['P1']
    p2 = data['red']['P2']
    lam = data['red']['lambda']

    c_coef = sfunc.C_Coef(p1, p2, lam, q0)
    d_coef = sfunc.D_Coef(p1, p2, lam, q0)

    red = [sfunc.modTanh(p1,p2,lam,q0, q, c_coef, d_coef) for q in range(256)]

    # green transform
    q0 = data['green']['q0']
    p1 = data['green']['P1']
    p2 = data['green']['P2']
    lam = data['green']['lambda']

    c_coef = sfunc.C_Coef(p1, p2, lam, q0)
    d_coef = sfunc.D_Coef(p1, p2, lam, q0)

    green = [sfunc.modTanh(p1,p2,lam,q0, q, c_coef, d_coef) for q in range(256)]

    # blue transform
    q0 = data['blue']['q0']
    p1 = data['blue']['P1']
    p2 = data['blue']['P2']
    lam = data['blue']['lambda']

    c_coef = sfunc.C_Coef(p1, p2, lam, q0)
    d_coef = sfunc.D_Coef(p1, p2, lam, q0)

    blue = [sfunc.modTanh(p1,p2,lam,q0, q, c_coef, d_coef) for q in range(256)]


    return {
        "redArray": red,
        "greenArray": green,
        "blueArray": blue
    }

@app.get("/posts/")
def read_all_posts():
    return crud.get_all_posts()

@app.post("/posts/")
async def create_post_endpoint(request: Request, db: Session = Depends(get_db)):
    user_id = request.cookies.get("session_id")
    if not user_id:
        return JSONResponse({"error": "No autenticado"}, status_code=401)
    
    data = await request.json()
    title = data.get("title")
    descrition = data.get("descrition")
    image_id = data.get("image_id")

    if not title or not descrition or not image_id:
        return JSONResponse({"error": "Faltan campos obligatorios"}, status_code=400)
    
    post = crud.create_post(db, title, descrition, int(user_id), image_id)
    return post

################ THE CODE BELOW IS ONLY FOR TESTING#####################

#########CRUD USERS FOR TESTING ONLY###################
@app.get("/users/{user_id}")
def get_user_info(user_id: int,  db: Session = Depends(get_db)):
    return crud.get_user_by_id(db, user_id)

@app.put("/users/{user_id}")
def update_user_route(user_id: int, nickname: str, username: str, usersurname: str, email: str, db: Session = Depends(get_db)):
    return crud.update_user(db, user_id, nickname, username, usersurname, email)

@app.delete("/users/{user_id}")
def delete_user_route(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id)
    return {"deleted": success}



#####DELETE THIS AFTER TEST############################
@app.get("/dbtest")
def test_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM passwords")).mappings().all()
    return {"test_query": result if result else "no users"}

@app.get("/users")
def list_all_users(db: Session = Depends(get_db)):
    return crud.list_users(db)

@app.put("/update-password")
def update_password(user_id: int, password_hash: str, db: Session = Depends(get_db)):
    updated = crud.update_password(db, user_id, password_hash)
    if updated:
        return updated
    return {"error": "Usuario no encontrado o no tiene contraseña registrada"}

###############################################################