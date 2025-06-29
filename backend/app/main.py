from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from fastapi.responses import JSONResponse

#################### to test the db connection
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import SessionLocal
from . import crud

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
########################################################

app = FastAPI()


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
    
    stored = crud.get_password_by_user_id(db, user["id"])
    if stored == None or stored["password_hash"] != password:
        return JSONResponse({"error":"Contraseña incorrecta"}, status_code=401)
    
    # Crear cookie de sesión insegura (id del usuario)
    response = JSONResponse(content={"message":"Login exitoso", "user_id": user["id"]})
    response.set_cookie(
        key= "session_id",
        value=str(user["id"]),
        httponly=True, #Security risk
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