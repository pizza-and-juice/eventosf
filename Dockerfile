# Etapa base: usar Node.js
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app con Vite
RUN npm run build

# Exponer el puerto de Vite preview (por defecto 4173)
EXPOSE 4173

# Comando para producción
CMD ["npm", "run", "preview", "--", "--host"]
