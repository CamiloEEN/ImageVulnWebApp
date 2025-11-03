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

def get_user_by_email(db: Session, email: str) -> Optional[dict]:
    #email = email.strip().lower()  # Normalizamos el email de entrada
    query = text(f"SELECT * FROM users WHERE email = '{email}'")
    result = db.execute(query).mappings().fetchone()
    return dict(result) if result else None


def update_user(db: Session, user_id: int, nickname: str, username: str, usersurname: str, email: str) -> dict:
    query = text("""
        UPDATE users
        SET nickname = :nickname, username = :username, usersurname = :usersurname, email = :email
        WHERE id = :user_id
        RETURNING id, nickname, username, usersurname, email
    """)
    result = db.execute(query, {"user_id":user_id ,"nickname": nickname, "username": username, "usersurname": usersurname, "email": email}).mappings().fetchone()
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

def check_password(db: Session, user_id: int, password_hash: str) -> dict:
    query = text(f"SELECT u.id FROM users AS u  JOIN passwords AS p ON p.user_id = {user_id}  WHERE p.password_hash = '{password_hash}' ")
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


############################ TABLE IMAGES CRUD ####################

def create_image(db: Session, user_id: int, filename: str, mime_type: str, size: int) -> dict:
    query = text("""
        INSERT INTO images (user_id, filename, mime_type, size)
        VALUES (:user_id, :filename, :mime_type, :size)
        RETURNING id, user_id, filename, mime_type, size
    """)
    result = db.execute(query, {
        "user_id": user_id,
        "filename": filename,
        "mime_type": mime_type,
        "size": size
    }).mappings().fetchone()
    db.commit()
    return dict(result)

def get_image_by_id(db: Session, image_id: int) -> Optional[dict]:
    query = text("SELECT * FROM images WHERE id = :image_id")
    result = db.execute(query, {"image_id": image_id}).mappings().fetchone()
    return dict(result) if result else None

def get_images_by_user_id(db: Session, user_id: int) -> list[dict]:
    query = text("SELECT * FROM images WHERE user_id = :user_id ORDER BY uploaded_at DESC")
    results = db.execute(query, {"user_id": user_id}).mappings().fetchall()
    return [dict(row) for row in results]

def delete_image_by_id(db: Session, image_id: int) -> None:
    query = text("DELETE FROM images WHERE id = :image_id")
    db.execute(query, {"image_id": image_id})
    db.commit()


############################ TABLE POSTS CRUD ####################
def create_post(db: Session, title: str, description: str, user_id: int, image_id: int):
    query = text("""
        INSERT INTO posts (title, description, user_id, image_id)
        VALUES (:title, :description, :user_id, :image_id)
        RETURNING id, title, description, created_at, user_id, image_id
    """)
    result = db.execute(query, {"title":title, "description":description, "user_id":user_id, "image_id":image_id}).mappings().fetchone()
    db.commit()

    return dict(result)

def get_post_by_id(db: Session, post_id: int):
    query = text("SELECT * FROM posts WHERE id = :post_id")
    result = db.execute(query, {"post_id":post_id}).mappings().fetchone()
    return dict(result) if result else None
    pass

def get_posts_by_user_id(db: Session, user_id: int):
    query = text("SELECT * FROM posts WHERE user_id = :user_id ORDER BY created_at DESC")
    result = db.execute(query, {"user_id": user_id}).mappings().fetchall()
    return [dict(row) for row in result]

def get_all_posts(db: Session):
    query = text("SELECT * FROM posts ORDER BY created_at DESC")
    result = db.execute(query).mappings().fetchall()
    return [dict(row) for row in result]

def update_post(db: Session, post_id: int, title: str, description: str):
    query = text("""
        UPDATE posts
        SET title = :title, description = :description
        WHERE id = :post_id
        RETURNING id, title, description, created_at, user_id, image_id
    """)
    result = db.execute(query, {
        "post_id": post_id,
        "title": title,
        "description": description
    }).mappings().fetchone()
    db.commit()
    return dict(result) if result else None

def delete_post(db: Session, post_id: int):
    query = text("DELETE FROM posts WHERE id = :post_id")
    db.execute(query, {"post_id": post_id})
    db.commit()
    return {"message": "Post deleted successfully"}

############################ TABLE COMMENTS CRUD ####################
# Crear un nuevo comentario
def create_comment(db, post_id, user_id, content):
    query = text("""
        INSERT INTO comments (post_id, user_id, content)
        VALUES (:post_id, :user_id, :content)
        RETURNING id, post_id, user_id, content, created_at
    """)
    result = db.execute(query, {
        "post_id": post_id,
        "user_id": user_id,
        "content": content,
    }).mappings().fetchone()
    db.commit()
    return dict(result)

# Obtener un comentario por su ID
def get_comment_by_id(db, comment_id):
    query = text("SELECT * FROM comments WHERE id = :comment_id")
    result = db.execute(query, {"comment_id": comment_id}).mappings().fetchone()
    return dict(result) if result else None

# Obtener todos los comentarios para un post específico
def get_comments_by_post_id(db, post_id):
    query = text("SELECT * FROM comments WHERE post_id = :post_id ORDER BY created_at ASC")
    results = db.execute(query, {"post_id": post_id}).mappings().fetchall()
    return [dict(row) for row in results]

# Obtener todos los comentarios hechos por un usuario
def get_comments_by_user_id(db, user_id):
    query = text("SELECT * FROM comments WHERE user_id = :user_id ORDER BY created_at DESC")
    results = db.execute(query, {"user_id": user_id}).mappings().fetchall()
    return [dict(row) for row in results]

# Actualizar el contenido de un comentario
def update_comment(db, comment_id, new_content):
    query = text("""
        UPDATE comments
        SET content = :new_content
        WHERE id = :comment_id
        RETURNING id, post_id, user_id, content, created_at
    """)
    result = db.execute(query, {
        "comment_id": comment_id,
        "new_content": new_content
    }).mappings().fetchone()
    db.commit()
    return dict(result) if result else None

# Eliminar un comentario
def delete_comment(db, comment_id):
    query = text("DELETE FROM comments WHERE id = :comment_id")
    db.execute(query, {"comment_id": comment_id})
    db.commit()

############################ TABLE LIKES CRUD ####################
# Crear un nuevo "like"
def create_like(db, post_id, user_id):
    query = text("""
        INSERT INTO likes (post_id, user_id)
        VALUES (:post_id, :user_id)
        RETURNING id, post_id, user_id, created_at
    """)
    result = db.execute(query, {
        "post_id": post_id,
        "user_id": user_id
    }).mappings().fetchone()
    db.commit()
    return dict(result)

# Verificar si un usuario ya dio like a un post
def get_like_by_user_and_post(db, user_id, post_id):
    query = text("SELECT * FROM likes WHERE user_id = :user_id AND post_id = :post_id")
    result = db.execute(query, {
        "user_id": user_id,
        "post_id": post_id
    }).mappings().fetchone()
    return dict(result) if result else None

# Obtener todos los likes de un post
def get_likes_by_post_id(db, post_id):
    query = text("SELECT * FROM likes WHERE post_id = :post_id")
    results = db.execute(query, {"post_id": post_id}).mappings().fetchall()
    return [dict(row) for row in results]

# Contar likes de un post
def count_likes_by_post_id(db, post_id):
    query = text("SELECT COUNT(*) FROM likes WHERE post_id = :post_id")
    result = db.execute(query, {"post_id": post_id}).scalar()
    return result

# Eliminar un like (unlike)
def delete_like(db, user_id, post_id):
    query = text("DELETE FROM likes WHERE user_id = :user_id AND post_id = :post_id")
    db.execute(query, {
        "user_id": user_id,
        "post_id": post_id
    })
    db.commit()

############################ TABLE History CRUD ####################
