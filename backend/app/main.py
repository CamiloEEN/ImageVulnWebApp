from fastapi import FastAPI
from .database import engine, Base

#################### to test the db connection
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from .database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
########################################################

app = FastAPI()

@app.get("/")
def read_root():
    return {"message":"backend is running"}

#####DELETE THIS AFTER TEST############################
@app.get("/dbtest")
def test_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT nickname FROM users LIMIT 1")).fetchone()
    return {"test_query": result[0] if result else "no users"}
###############################################################