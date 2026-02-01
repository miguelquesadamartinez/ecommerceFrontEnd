# Usar Node.js 18 LTS
FROM node:18-alpine

# Información del mantenedor
LABEL maintainer="Miguel Quesada Martinez"
LABEL description="NoName Direct E-Commerce Frontend - Vue.js Application"

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    curl \
    bash

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando por defecto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
