# Etapa 1: Construcción
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:stable-alpine

# Copia el build de Vite a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Opcional: reemplazar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
