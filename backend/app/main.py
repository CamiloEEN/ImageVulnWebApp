from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base

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
    allow_origins=["http://127.0.0.1:5173"],  # o ["*"] para permitir todo (inseguro)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message":"backend is running"}


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
    result = db.execute(text("SELECT * FROM passwords LIMIT 1")).fetchone()
    return {"test_query": result[1] if result else "no users"}

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