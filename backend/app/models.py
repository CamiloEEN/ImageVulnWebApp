from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users" # debe ser igual al nombre de la tabla en postgresql
    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, unique=True, nullable = False)
    username = Column(String, nullable = False)
    usersurname = Column(String, nullable = False)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Password(Base):
    __tablename__ = "passwords"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    password_hash = Column(String, nullable=False)

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    size = Column(Integer)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.id"), nullable=False)

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_id = Column(Integer, ForeignKey("images.id"), nullable=False)
    transformation_vector = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)


