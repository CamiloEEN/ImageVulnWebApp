# Etapa 1: Construcción de la app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servir los archivos estáticos con Nginx
FROM nginx:alpine

# Copia la build desde la etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Copia tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 (por defecto de nginx)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
