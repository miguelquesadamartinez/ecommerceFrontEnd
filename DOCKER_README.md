# 🐳 Docker - Guía de Uso Frontend

## Descripción General

Este proyecto utiliza Docker para contenerizar la aplicación **Vue.js frontend**, facilitando el desarrollo sin necesidad de instalar Node.js localmente. El contenedor se conecta a un backend separado (Laravel API) que corre en otro contenedor Docker.

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         Docker Environment              │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  noname_frontend (Node.js 18)    │  │
│  │  - Vue.js 3 Application          │  │
│  │  - Vite Dev Server               │  │
│  │  - Hot Module Replacement        │  │
│  │  Puerto: 5173                    │  │
│  └──────────────────────────────────┘  │
│              ↓                          │
│      Red: noname_network                │
│              ↓                          │
│  ┌──────────────────────────────────┐  │
│  │   Backend Docker (Separado)      │  │
│  │   - Laravel API                  │  │
│  │   - MySQL Database               │  │
│  │   - phpMyAdmin                   │  │
│  │   Puerto: 90                     │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## 📦 Servicio Incluido

### Frontend Vue.js (noname_frontend)

- **Base:** Node.js 18 Alpine (ligera y optimizada)
- **Puerto:** 5173
- **Características:**
  - Vue.js 3.5.13
  - Vite 6.2.0 (servidor de desarrollo)
  - Hot Module Replacement (HMR)
  - Sincronización de código en tiempo real
  - Auto-instalación de dependencias NPM
- **Volúmenes:**
  - Código fuente sincronizado con el host
  - `node_modules` aislado en contenedor

## 🚀 Inicio Rápido

### 1. Crear red compartida (primera vez)

```bash
docker network create noname_network
```

Esta red permite que el frontend y backend se comuniquen.

### 2. Levantar el contenedor

```bash
docker-compose up -d
```

### 3. Verificar estado

```bash
docker-compose ps
```

Deberías ver:

```
NAME                    STATUS              PORTS
noname_frontend        Up                  0.0.0.0:5173->5173/tcp
```

### 4. Ver logs

```bash
docker-compose logs -f
```

### 5. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:90/api (debe estar corriendo)

## 📝 Comandos Frecuentes

### Gestión de Contenedores

```bash
# Iniciar el contenedor
docker-compose up -d

# Detener el contenedor
docker-compose stop

# Detener y eliminar el contenedor
docker-compose down

# Reiniciar el contenedor
docker-compose restart

# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir la imagen
docker-compose build --no-cache

# Ver estado
docker-compose ps
```

### Acceso y Debugging

```bash
# Entrar al contenedor
docker exec -it noname_frontend sh

# Ejecutar comandos npm sin entrar
docker exec noname_frontend npm --version

# Ver variables de entorno
docker exec noname_frontend env | grep VITE

# Ver archivos dentro del contenedor
docker exec noname_frontend ls -la /app

# Ver node_modules instalados
docker exec noname_frontend ls -la /app/node_modules
```

### Gestión de Dependencias

```bash
# Instalar nueva dependencia
docker exec noname_frontend npm install [paquete]

# Instalar dependencia de desarrollo
docker exec noname_frontend npm install -D [paquete]

# Actualizar dependencias
docker exec noname_frontend npm update

# Limpiar caché de npm
docker exec noname_frontend npm cache clean --force

# Reinstalar dependencias
docker-compose down
docker-compose up -d --build
```

### Desarrollo Frontend

```bash
# Build para producción
docker exec noname_frontend npm run build

# Preview del build
docker exec noname_frontend npm run preview

# Ejecutar comandos personalizados
docker exec noname_frontend npm run [comando]
```

## 🔧 Configuración

### Variables de Entorno

Archivo: `.env.docker`

```env
# Node Environment
NODE_ENV=development

# API Backend (se conecta a otro contenedor Docker)
VITE_API_URL=http://localhost:90/api
VITE_URL=http://127.0.0.1:90

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Cambiar Puerto

Si el puerto 5173 está en uso, edita `docker-compose.yml`:

```yaml
services:
  frontend:
    ports:
      - "5174:5173" # Cambiar el primer número
```

### Conectar con Backend

Asegúrate de que:

1. **El backend esté corriendo** en otro contenedor
2. **Ambos contenedores** estén en la red `noname_network`
3. **La variable `VITE_API_URL`** apunte correctamente al backend

Para verificar la red:

```bash
docker network inspect noname_network
```

Deberías ver tanto `noname_frontend` como el contenedor del backend.

### Personalizar Configuración de Vite

Edita `vite.config.js` para cambiar configuraciones:

```javascript
export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite acceso externo
    port: 5173,
    watch: {
      usePolling: true, // Útil en Windows
    },
  },
});
```

## 🔥 Hot Module Replacement (HMR)

El contenedor está configurado con HMR activo:

- ✅ Los cambios en archivos `.vue`, `.js`, `.css` se reflejan automáticamente
- ✅ No necesitas reiniciar el contenedor
- ✅ El navegador se actualiza sin perder el estado
- ✅ Experiencia similar a desarrollo local

### Si HMR no funciona:

```bash
# Verificar que el volumen está montado
docker inspect noname_frontend | grep -A 10 Mounts

# Reiniciar el contenedor
docker-compose restart

# Si persiste, reconstruir
docker-compose down && docker-compose up -d --build
```

## 🐞 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs de error detallados
docker-compose logs

# Verificar que Docker está corriendo
docker ps

# Verificar puerto en uso
netstat -ano | findstr "5173"

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### No se conecta al backend

```bash
# Verificar que el backend está corriendo
docker ps | grep backend

# Verificar red compartida
docker network inspect noname_network

# Verificar variables de entorno
docker exec noname_frontend env | grep VITE_API_URL

# Probar conexión desde el contenedor
docker exec noname_frontend wget -O- http://localhost:90/api/health
```

### Los cambios no se reflejan

```bash
# Verificar montaje de volúmenes
docker inspect noname_frontend

# Limpiar y reconstruir
docker-compose down
rm -rf node_modules
docker-compose up -d --build

# Verificar que Vite está corriendo
docker-compose logs -f
```

### Errores de permisos (Windows)

```bash
# Asegurar que Docker tiene acceso a la carpeta
# Docker Desktop -> Settings -> Resources -> File Sharing
# Añadir la ruta del proyecto

# Reiniciar Docker Desktop
```

### Puerto en uso

```bash
# Windows - Ver qué proceso usa el puerto
netstat -ano | findstr "5173"

# Matar proceso
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
```

### Problemas con node_modules

```bash
# Eliminar node_modules del contenedor
docker-compose down
docker volume prune

# Reconstruir
docker-compose up -d --build

# Verificar instalación
docker exec noname_frontend npm list --depth=0
```

## 🧹 Mantenimiento

### Limpiar recursos de Docker

```bash
# Ver espacio usado
docker system df

# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune

# Limpiar todo (¡cuidado!)
docker system prune -a

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Eliminar contenedor específico
docker rm noname_frontend
```

### Actualizar la imagen base

```bash
# Descargar última versión de Node.js
docker pull node:18-alpine

# Reconstruir con la nueva imagen
docker-compose build --no-cache
docker-compose up -d
```

### Backup del código

El código está en tu máquina local, pero puedes:

```bash
# Exportar configuración
docker-compose config > docker-config-backup.yml

# Ver volúmenes
docker volume ls

# Inspeccionar volumen
docker volume inspect [volume_name]
```

## 📊 Monitoreo

### Ver recursos utilizados

```bash
# Ver CPU, RAM, I/O en tiempo real
docker stats noname_frontend

# Ver procesos dentro del contenedor
docker exec noname_frontend ps aux

# Ver espacio en disco del contenedor
docker exec noname_frontend df -h
```

### Ver logs específicos

```bash
# Logs completos
docker-compose logs

# Últimas 100 líneas
docker-compose logs --tail=100

# Desde hace 1 hora
docker-compose logs --since 1h

# Logs de Vite específicamente
docker-compose logs | grep "vite"
```

## 🔐 Seguridad

### Mejores prácticas:

1. **No expongas puertos innecesarios** en producción
2. **Usa variables de entorno** para configuración sensible
3. **Actualiza la imagen base** regularmente
4. **Limita recursos** del contenedor si es necesario:

```yaml
services:
  frontend:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
```

## 🚀 Producción

Este Docker está diseñado para **desarrollo local**. Para producción:

1. Crea un `Dockerfile.prod` con build optimizado
2. Usa nginx para servir archivos estáticos
3. Implementa health checks
4. Usa variables de entorno seguras
5. Considera usar multi-stage builds

### Ejemplo Dockerfile.prod:

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Official Image](https://hub.docker.com/_/node)
- [Vite Documentation](https://vitejs.dev/)
- [Vue.js Docker Guide](https://vuejs.org/guide/scaling-up/tooling.html#docker)

## 🆘 Soporte

Para problemas o preguntas:

1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Consulta este README
4. Verifica la red: `docker network inspect noname_network`
5. Contacta al desarrollador: Miguel Quesada Martinez

---

**Desarrollador:** Miguel Quesada Martinez  
**Proyecto:** NoName Direct E-Commerce Frontend  
**Versión Docker:** Node.js 18 Alpine  
**Año:** 2025-2026
