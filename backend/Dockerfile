# Usa la versión 3.12 de Python
FROM python:3.12-slim

# Instala dependencias necesarias para psycopg2 y numpy
RUN apt-get update && apt-get install -y gcc libpq-dev

# Establece el directorio de trabajo
WORKDIR /app

# Copia el código fuente (excluye venv)
COPY ./app /app/app
COPY requirements.txt .

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Expone el puerto del backend
EXPOSE 8000

# Comando para arrancar FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
