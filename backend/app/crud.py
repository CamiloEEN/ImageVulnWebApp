from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional


########################################## TABLE USERS CRUD################
# 🔐 No validation! Accept raw inputs — good for vulnerability tests

def list_users(db: Session) -> list[dict]:
    query = text("SELECT * FROM users")
    return db.execute(query).mappings().all()

def create_user(db: Session, nickname: str, username: str, usersurname: str,email: str) -> dict:
    query = text("""
        INSERT INTO users (nickname, username, usersurname, email)
        VALUES (:nickname, :username, :usersurname, :email)
        RETURNING id, nickname, username, usersurname, email
    """)
    result = db.execute(query, {"nickname": nickname, "username": username, "usersurname": usersurname, "email": email}).mappings().fetchone()
    db.commit()
    return dict(result)

def get_user_by_id(db: Session, id: int)->Optional[dict]:
    query = text("SELECT * from users WHERE id = :id")
    result = db.execute(query, {"id" :id}).mappings().fetchone()
    return dict(result) if result else None

def get_user_by_nickname(db: Session, nickname: str)->Optional[dict]:
    query = text("SELECT * from users WHERE nickname = :nickname")
    result = db.execute(query, {"nickname" :nickname}).mappings().fetchone()
    return dict(result) if result else None

def get_user_by_email(db: Session, email: str)->Optional[dict]:
    query = text("SELECT * from users WHERE email = :email")
    result = db.execute(query, {"email" :email}).mappings().fetchone()
    return dict(result) if result else None


def update_user(db: Session, user_id: int, nickname: str, username: str, usersurname: str, email: str) -> dict:
    query = text("""
        UPDATE users
        SET nickname = :nickname, username = :username, usersurname = :usersurname, email = :email
        WHERE id = :user_id
        RETURNING id, nickname, username, usersurname, email
    """)
    result = db.execute(query, {"nickname": nickname, "username": username, "usersurname": usersurname, "email": email}).mappings().fetchone()
    db.commit()
    return dict(result) if result else {}

def delete_user(db: Session, user_id: int) -> bool:
    query = text("DELETE FROM users WHERE id = :user_id")
    result = db.execute(query, {"user_id": user_id})
    db.commit()
    return result.rowcount > 0  # True if any row was deleted


########################################## TABLE PASSWORDS CRUD################

def create_password(db: Session, user_id: int, password_hash: str) -> dict:
    query = text("""
        INSERT INTO passwords (user_id, password_hash)
        VALUES (:user_id, :password_hash)
        RETURNING user_id, password_hash
    """)
    result = db.execute(query, {"user_id": user_id, "password_hash": password_hash}).mappings().fetchone()
    db.commit()
    return dict(result)


def get_password_by_user_id(db: Session, user_id: int) -> Optional[dict]:
    query = text("SELECT * FROM passwords WHERE user_id = :user_id")
    result = db.execute(query, {"user_id": user_id}).mappings().fetchone()
    return dict(result) if result else None

def update_password(db: Session, user_id: int, password_hash: str) -> dict:
    query = text("""
        UPDATE passwords
        SET password_hash = :password_hash
        WHERE user_id = :user_id
        RETURNING user_id, password_hash
    """)
    result = db.execute(query, {"user_id": user_id, "password_hash": password_hash}).mappings().fetchone()
    db.commit()
    return dict(result)

###### FOR OBVIOUS REASONS THERE IS NO DELETE PASSWORD, THEY ARE ONLY DELETED IF THE USER IS DELETED


