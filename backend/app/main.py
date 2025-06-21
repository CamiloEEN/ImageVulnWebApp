from fastapi import FastAPI
from .database import engine, Base

app = FastAPI()

@app.get("/")
def read_root():
    return {"message":"backend is running"}