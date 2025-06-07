# 🛡️ ImageVulnWebApp – Web App de Edición de Imágenes con Vulnerabilidades

Este proyecto forma parte del trabajo final del Máster en Ciberseguridad, en el módulo de Hacking Ético. Se trata de una máquina virtual vulnerable que contiene una aplicación web funcional para editar imágenes usando transformaciones no lineales píxel a píxel. Además de cumplir un objetivo funcional, la aplicación incluye vulnerabilidades intencionadas para su posterior análisis y explotación ética.

---

## 🧠 Motivación

1. **Aprender desarrollo web fullstack**: Aunque el enfoque del curso es sobre explotación, este proyecto me permite fortalecer conocimientos prácticos en desarrollo web (frontend, backend, docker, autenticación, bases de datos, etc.).
2. **Aplicar técnica original**: La aplicación implementa una técnica de mejora de contraste de imágenes basada en un plugin previamente desarrollado en ImageJ, adaptado a un entorno web.
3. **Crear entorno vulnerable controlado**: Permite simular situaciones reales para análisis y pruebas de vulnerabilidades comunes.

---

## 🧱 Estructura del proyecto

```yaml
inseura-app/
│
├── frontend/ # Aplicación React + Vite (carga imagen, aplica filtro, autenticación)
├── backend/ # API en FastAPI (recibe parámetros, retorna vector de transformación)
├── docker/ # Dockerfiles y configuración para levantar la app completa
├── docker-compose.yml
└── README.md # Este archivo
```

## 🔧 Tecnologías

| Parte         | Herramienta principal         |
|--------------|-------------------------------|
| Frontend     | React + Vite + JavaScript     |
| Backend      | FastAPI + Python 3            |
| Auth         | JWT / manejo de sesiones      |
| Base de datos| SQLite (o PostgreSQL)         |
| Contenedores | Docker + docker-compose       |
| Edición      | HTML5 Canvas + JS             |
| Vulnerabilidades | XSS, CSRF, Broken Auth, etc. |

---

## 🎯 Funcionalidad principal

- Registro e inicio de sesión de usuarios.
- Carga de imágenes desde el navegador.
- Aplicación de filtros de edición de contraste (transformación no lineal).
- Interfaz simple e interactiva.
- Backend retorna un **vector de 256 valores** que describe la transformación.
- Transformación aplicada directamente en el **frontend** (no se envía la imagen al servidor).

---

## 💣 Vulnerabilidades intencionales

- Validación insuficiente de formularios (XSS).
- Manejo inseguro de tokens/autenticación.
- Inyección de datos en frontend y backend.
- Acceso a rutas administrativas desde la UI.
- Falta de protección CSRF en operaciones críticas.

---

## 🚀 Cómo ejecutar (modo desarrollo)

1. Clona el repositorio:

```bash
git clone https://github.com/CamiloEEN/ImageVulnWebApp.git
cd ImageVulnWebApp
```

2. Levanta todo con Docker:

```bash
docker-compose up --build
```

3. Accede a la app:

- Frontend: http://localhost:5173

- Backend API: http://localhost:8000


## 👨‍💻 Autor
Camilo Eduardo Echeverry Naranjo
Estudiante de Máster en Ciberseguridad
Especialidad: Hacking Ético y Desarrollo de Aplicaciones Seguras

## 📜 Licencia
Este proyecto se usa exclusivamente con fines educativos y de investigación en ciberseguridad. No debe ser utilizado en producción ni en entornos no controlados.


