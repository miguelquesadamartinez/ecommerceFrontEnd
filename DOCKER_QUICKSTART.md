# 🚀 Inicio Rápido con Docker

## Levantar el entorno frontend

```bash
# 1. Iniciar Docker Desktop (Windows)

# 2. Crear red compartida (solo primera vez)
docker network create noname_network

# 3. En la raíz del proyecto, ejecutar:
docker-compose up -d

# 4. Esperar a que el servicio esté listo (~15-30 segundos)
docker-compose ps

# 5. Ver logs en tiempo real
docker-compose logs -f
```

## Acceder a los servicios

- 🌐 **Frontend Vue.js:** http://localhost:5173
- 🔌 **Backend API:** http://localhost:90/api (debe estar en otro contenedor)

**Nota:** Asegúrate de que el contenedor del backend (Laravel) esté corriendo en la red `noname_network` para que el frontend pueda conectarse.

## Comandos útiles del día a día

```bash
# Ver estado del contenedor
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Detener el contenedor
docker-compose stop

# Reiniciar el contenedor
docker-compose restart

# Detener y eliminar el contenedor
docker-compose down

# Entrar al contenedor
docker exec -it noname_frontend sh

# Instalar nueva dependencia
docker exec noname_frontend npm install [paquete]

# Build para producción
docker exec noname_frontend npm run build
```

## Verificar conexión con backend

```bash
# Ver la red compartida
docker network inspect noname_network

# Deberías ver tanto el frontend como el backend listados

# Verificar variables de entorno
docker exec noname_frontend env | grep VITE_API_URL
```

## ¿Problemas?

1. **Verifica logs:** `docker-compose logs -f`
2. **Verifica estado:** `docker-compose ps`
3. **Reinicia:** `docker-compose restart`
4. **Reconstruye:** `docker-compose down && docker-compose up -d --build`
5. **Verifica red:** `docker network inspect noname_network`
6. **Consulta:** [DOCKER_README.md](DOCKER_README.md) para troubleshooting detallado

## Hot Module Replacement (HMR)

✅ Los cambios en tu código se reflejan automáticamente  
✅ No necesitas reiniciar el contenedor  
✅ El navegador se actualiza sin perder estado

Simplemente edita tus archivos `.vue`, `.js` o `.css` y ve los cambios instantáneamente en http://localhost:5173

---

**Desarrollador:** Miguel Quesada Martinez  
**Proyecto:** NoName Direct - Frontend Vue.js en Docker  
**Stack:** Node.js 18 + Vue.js 3 + Vite 6
