# 🏥 France Direct - Frontend E-Commerce

## 📋 Resumen del Proyecto

**NoName Direct** es una aplicación web frontend desarrollada para gestionar el sistema de e-commerce de NoName. Esta plataforma permite a teleoperadoras registrar, gestionar y procesar pedidos de productos farmacéuticos para farmacias. El sistema incluye funcionalidades completas de gestión de pedidos, productos, farmacias, stocks y condiciones comerciales.

### 🎯 Propósito

Sistema diseñado específicamente para que el personal de atención telefónica de NoName pueda:

- Registrar pedidos de farmacias de manera eficiente
- Gestionar catálogo de productos farmacéuticos
- Administrar información de clientes (farmacias)
- Controlar stocks, asignaciones y contingentamientos
- Importar/exportar datos masivos en formato Excel
- Gestionar condiciones comerciales y precios

---

## 👨‍💻 Información del Desarrollador

**Desarrollador:** Miguel Quesada Martinez
**Proyecto:** Sistema Frontend E-Commerce para NoName  
**Tipo:** Single Page Application (SPA)  
**Cliente:** NoName  
**Año:** 2025-2026

---

## 🛠️ Stack Tecnológico

### Frontend Framework

- **Vue.js 3.5.13** - Framework JavaScript progresivo
  - Composition API
  - Script Setup
  - Reactive System

### Build Tool

- **Vite 6.2.0** - Build tool de próxima generación
  - Hot Module Replacement (HMR)
  - Optimización de bundle
  - Desarrollo rápido

### Routing

- **Vue Router 4.5.0** - Sistema de enrutamiento oficial
  - Navegación SPA
  - Guards de autenticación
  - Lazy loading de componentes

### HTTP Client

- **Axios 1.8.1** - Cliente HTTP
  - Interceptores
  - Manejo de tokens
  - Configuración centralizada

### UI Framework

- **Bootstrap 5.3.6** - Framework CSS
  - SB Admin 2 Theme
  - Componentes responsive
  - Sistema de grid

### Librerías Adicionales

- **XLSX 0.18.5** - Importación/Exportación Excel
- **jQuery 3.6.0** - Manipulación DOM (legacy)
- **DataTables 1.13.4** - Tablas interactivas
- **Font Awesome 6.0** - Iconografía
- **Vue-Recaptcha 3.0** - Protección anti-bot

### Backend Integration

- **Backend:** Laravel (PHP 8.2)
- **API URL:** `http://127.0.0.1:90/api`
- **Autenticación:** Laravel Sanctum (Token-based)
- **Proxy de Desarrollo:** Vite Dev Server
- **Base de Datos:** MySQL 8.0
- **Gestión DB:** phpMyAdmin
- **Docker:** Contenedor Node.js para desarrollo frontend

---

## 📁 Estructura del Proyecto

```
ecommerceFrontEnd/
├── public/                         # Archivos estáticos
│   ├── css/
│   │   └── sb-admin-2.css         # Estilos del tema
│   ├── js/
│   │   ├── app.js                 # Scripts globales
│   │   ├── iban.js                # Validación IBAN
│   │   ├── menu.js                # Manejo del menú
│   │   └── sb-admin-2.min.js      # Tema SB Admin
│   ├── vendor/                    # Librerías externas
│   │   ├── bootstrap/             # Bootstrap 5
│   │   └── jquery-easing/         # Efectos jQuery
│   └── web.config                 # Configuración IIS
│
├── src/                           # Código fuente
│   ├── assets/                    # Recursos estáticos
│   │
│   ├── components/                # Componentes Vue reutilizables
│   │   ├── HelloWorld.vue
│   │   ├── OrdersList.vue
│   │   ├── PharmaciesList.vue
│   │   ├── ProductsList.vue
│   │   └── layouts/
│   │       ├── HeaderLayout.vue   # Encabezado principal
│   │       └── SidebarLayout.vue  # Menú lateral
│   │
│   ├── config/                    # Configuración
│   │   └── config.js              # Variables de configuración API
│   │
│   ├── layouts/                   # Layouts principales
│   │   ├── MainLayout.vue         # Layout con sidebar/header
│   │   └── SimpleLayout.vue       # Layout simple (login)
│   │
│   ├── plugins/                   # Plugins Vue
│   │   ├── axios.js               # Configuración Axios
│   │   └── errorHandler.js        # Manejo de errores
│   │
│   ├── router/                    # Configuración de rutas
│   │   ├── index.js
│   │   └── router.js              # Definición de rutas
│   │
│   ├── services/                  # Servicios API
│   │   ├── api.js                 # Instancia Axios base
│   │   ├── authService.js         # Autenticación
│   │   ├── errorHandlingService.js # Manejo de errores
│   │   ├── getService.js          # Servicios GET
│   │   ├── orderService.js        # Gestión de pedidos
│   │   ├── pharmacyService.js     # Gestión de farmacias
│   │   └── productService.js      # Gestión de productos
│   │
│   ├── views/                     # Vistas/Páginas
│   │   ├── Home.vue               # Dashboard principal
│   │   ├── Login.vue              # Página de login
│   │   ├── Logout.vue             # Página de logout
│   │   ├── OrdersList.vue         # Lista de pedidos
│   │   ├── PharmaciesList.vue     # Lista de farmacias
│   │   ├── ProductsList.vue       # Lista de productos
│   │   │
│   │   ├── order/                 # Módulo de pedidos
│   │   │   ├── OrderConfirm.vue   # Confirmación de pedido
│   │   │   ├── OrderConfirmed.vue # Pedido confirmado
│   │   │   ├── OrderCreate.vue    # Crear/Editar pedido
│   │   │   └── Orders.vue         # Búsqueda de farmacia
│   │   │
│   │   ├── pharmacy/              # Módulo de farmacias
│   │   │   ├── PharmacyForm.vue   # Formulario farmacia
│   │   │   └── PharmacyList.vue   # Listado farmacias
│   │   │
│   │   └── product/               # Módulo de productos
│   │       ├── ProductForm.vue    # Formulario producto
│   │       ├── ProductList.vue    # Listado productos
│   │       └── ProductListStocks.vue # Gestión de stocks
│   │
│   ├── App.vue                    # Componente raíz
│   ├── main.js                    # Punto de entrada
│   └── style.css                  # Estilos globales
│
├── .env                           # Variables de entorno
├── index.html                     # HTML principal
├── package.json                   # Dependencias NPM
├── vite.config.js                 # Configuración Vite
├── web.config                     # Configuración IIS (producción)
└── README.md                      # Este archivo
```

---

## 🎯 Funcionalidades Principales

### 1. 🔐 Autenticación y Autorización

- Login con email y password
- Tokens JWT (Laravel Sanctum)
- Validación de tokens expirados
- Guards de navegación
- Gestión de sesiones (8 horas)
- Tipos de usuario (user_type)

### 2. 📦 Gestión de Pedidos

- **Búsqueda de farmacias** por CIP13 o teléfono
- **Creación de pedidos** con selección de productos
- **Edición de pedidos** existentes
- **Confirmación de pedidos** con resumen
- **Visualización de pedidos** por farmacia
- **Control de cantidades** (mínimo/máximo por producto)
- **Gestión de urgencias** (pedidos urgentes)
- **Estados de pedidos**: Pendiente, Exportado, etc.
- **Progreso visual** del valor del pedido

### 3. 🏪 Gestión de Farmacias

- **Listado paginado** de farmacias
- **Búsqueda** por nombre, CIP13 o ID SAP
- **Crear nuevas farmacias**
- **Editar datos** de farmacias existentes
- **Validación de IBAN**
- **Gestión de datos completos**:
  - Información general (nombre, tipo, estado)
  - Dirección completa
  - Datos de contacto (teléfono, fax, email)
  - Información bancaria (IBAN, código banco, RIB)
  - Datos legales (SIREN, SIRET)
  - Titular de la farmacia
- **Estados**: Activa, Bloqueada, Pendiente
- **Histórico de pedidos** por farmacia

### 4. 💊 Gestión de Productos

- **Listado completo** de productos con paginación
- **Búsqueda** por nombre, CIP13 o ID SAP
- **Crear nuevos productos**
- **Editar productos** existentes
- **Información de productos**:
  - ID SAP y CIP13
  - Presentación (nombre comercial)
  - Precio PGHT (Precio Fabricante)
  - Stock disponible
  - Peremption courte (caducidad próxima)
  - Fecha de expiración
  - Estado (Activo, Inactivo, Discontinuado)
- **Estados de productos**: Activo, Inactivo, Sin stock

### 5. 📊 Gestión de Stocks y Contingentamiento

- **Visualización de stocks** por producto
- **Configuración de límites**:
  - Mínimo por pedido
  - Máximo por pedido
  - Asignación (allocation)
  - Contingentamiento (quota)
- **Unidades vendibles**
- **Control de fechas de expiración**
- **Actualización masiva** mediante Excel

### 6. 📥📤 Importación/Exportación de Datos

#### Exportación a Excel

- **Productos**: Lista completa con precios y stocks
- **Formato estructurado** con encabezados
- **Filtros aplicados** se mantienen en exportación
- **Nombre de archivo** con fecha automática
- **Columnas exportadas**:
  - SAP, CIP13, Presentación
  - Precio PGHT
  - Peremption courte
  - Fecha de péremption
  - Statut
  - Última actualización

#### Importación desde Excel

- **Stocks de productos**: Actualización masiva
- **Validación de formato** de archivo
- **Verificación de encabezados**
- **Validación de datos**:
  - Campos obligatorios
  - Tipos de datos
  - Rangos numéricos
- **Reporte de errores** línea por línea
- **Procesamiento por lotes**
- **Columnas importadas**:
  - SAP, CIP13, Presentación
  - Min, Max, Allocation, Contingentement

### 7. 🔍 Búsqueda y Filtrado

- **Búsqueda en tiempo real**
- **Filtros múltiples**
- **Paginación** de resultados
- **Resultados por página**: Configurable (10, 25, 50, 100)
- **Autocompletado** en búsqueda de farmacias

### 8. 📱 Interfaz de Usuario

- **Diseño responsive** (Bootstrap 5)
- **Tema profesional** SB Admin 2
- **Notificaciones** de éxito/error
- **Indicadores visuales** (badges, progress bars)
- **Tablas interactivas** con DataTables
- **Iconografía** Font Awesome
- **Formularios validados**
- **Modales** para confirmaciones

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js**: 16.x o superior
- **NPM**: 8.x o superior (incluido con Node.js)
- **Backend Laravel**: Servidor corriendo en `http://127.0.0.1:90`

### Instalación

1. **Clonar el repositorio:**

```bash
git clone [REPOSITORY_URL]
cd ecommerceFrontEnd
```

2. **Instalar dependencias:**

```bash
npm install
```

3. **Configurar variables de entorno:**

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://127.0.0.1:90/api
VITE_URL=http://127.0.0.1:90
```

4. **Iniciar servidor de desarrollo:**

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con HMR

# Producción
npm run build            # Compilar para producción
npm run preview          # Preview del build de producción

# Mantenimiento
npm cache clean --force  # Limpiar caché de npm
rmdir /s /q node_modules # Eliminar node_modules (Windows)
rm -rf node_modules      # Eliminar node_modules (Linux/Mac)
```

### Build para Producción

```bash
# Build optimizado
npm run build

# Los archivos compilados estarán en /dist
# Copiar contenido de /dist al servidor web (IIS, Apache, Nginx)
```

---

## 🐳 Docker - Entorno de Desarrollo Frontend

### Descripción

Este proyecto utiliza Docker para contenerizar la aplicación **Vue.js** frontend, facilitando el desarrollo sin necesidad de instalar Node.js localmente. El contenedor se conecta a un backend separado (otro contenedor Docker con Laravel) para la API.

### Contenedor Disponible

- **Node.js 18 Alpine** - Aplicación Vue.js con Vite (Puerto: 5173)

### Configuración de Docker

#### Archivo `docker-compose.yml`

Contiene la definición del servicio frontend:

- Imagen Node.js 18 Alpine (ligera y optimizada)
- Hot Module Replacement (HMR) activo
- Volúmenes para sincronización de código
- Red compartida con el contenedor backend

#### Archivo `Dockerfile`

Imagen personalizada basada en Node.js 18 Alpine que incluye:

- Node.js 18 LTS
- NPM para gestión de dependencias
- Vite como servidor de desarrollo
- Configuración para acceso desde el host

### Instalación con Docker

#### Prerrequisitos

- **Docker Desktop**: Instalado y en ejecución
- **Docker Compose**: Incluido con Docker Desktop
- **Backend Docker**: Contenedor del backend corriendo (Laravel en puerto 90)

#### Pasos de Instalación

1. **Clonar el repositorio:**

```bash
git clone [REPOSITORY_URL]
cd ecommerceFrontEnd
```

2. **Configurar variables de entorno:**

El archivo `.env.docker` ya está configurado con:

```env
# Node Environment
NODE_ENV=development

# API Backend (se conecta a otro contenedor Docker)
VITE_API_URL=http://localhost:90/api
VITE_URL=http://127.0.0.1:90

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

3. **Crear red Docker compartida (si no existe):**

```bash
docker network create noname_network
```

Esta red permite que el frontend y backend se comuniquen entre contenedores.

4. **Construir y levantar el contenedor:**

```bash
docker-compose up -d
```

Este comando:

- Construye la imagen Node.js si no existe
- Instala automáticamente las dependencias NPM
- Inicia el servidor Vite en modo desarrollo
- Configura Hot Module Replacement (HMR)

5. **Verificar que el contenedor está corriendo:**

```bash
docker-compose ps
```

Deberías ver:

- `noname_frontend` - Estado: Up

6. **Ver logs del contenedor:**

```bash
docker-compose logs -f frontend
```

### Acceso a los Servicios

Una vez levantado el contenedor, puedes acceder a:

- **Frontend Vue.js**: http://localhost:5173
- **Backend API**: http://localhost:90/api (debe estar corriendo en otro contenedor)

### Comandos Docker Útiles

```bash
# Levantar el contenedor
docker-compose up -d

# Detener el contenedor
docker-compose down

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs del frontend
docker-compose logs -f frontend

# Reiniciar el contenedor
docker-compose restart frontend

# Reconstruir la imagen
docker-compose build --no-cache

# Entrar al contenedor para debugging
docker exec -it noname_frontend sh

# Ver estado del contenedor
docker-compose ps

# Instalar nuevas dependencias (dentro del contenedor)
docker exec -it noname_frontend npm install [paquete]

# Ejecutar comandos npm
docker exec -it noname_frontend npm run build
```

### Gestión de la Base de Datos

#### Acceso desde phpMyAdmin

1. Abre http://localhost:8081
2. Inicia sesión con:
   - Servidor: `mysql`
   - Usuario: `root`
   - Contraseña: `root_password`
3. Selecciona la base de datos `noname_ecommerce`

#### Scripts de Inicialización

Los scripts SQL en `docker/mysql/init/` se ejecutan automáticamente al crear el contenedor:

- `01-init.sql`: Crea la base de datos y tablas iniciales

Para añadir más scripts de inicialización, simplemente crea archivos `.sql` en ese directorio.

### Desarrollo con Docker

#### Hot Module Replacement (HMR)

El contenedor está configurado con HMR activo, lo que significa:

- Los cambios en el código se reflejan automáticamente en el navegador
- No necesitas reiniciar el contenedor al modificar archivos
- Experiencia de desarrollo similar a ejecutar `npm run dev` localmente

#### Estructura de Volúmenes

```yaml
volumes:
  - ./:/app # Sincroniza tu código con el contenedor
  - /app/node_modules # Usa node_modules del contenedor
```

Esto permite:

- Editar archivos localmente con tu editor favorito
- Los cambios se sincronizan automáticamente con el contenedor
- `node_modules` permanece en el contenedor (evita problemas de compatibilidad)

#### Conexión con Backend

El frontend se conecta al backend usando la red Docker `noname_network`. Asegúrate de que:

1. El backend esté corriendo en otro contenedor
2. Ambos contenedores estén en la misma red
3. La variable `VITE_API_URL` apunte al backend correcto

### Troubleshooting Docker

#### El contenedor no inicia

```bash
# Ver logs de error
docker-compose logs frontend

# Verificar puertos en uso
netstat -ano | findstr "5173"

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### No se conecta al backend

```bash
# Verificar que el backend está corriendo
docker ps | grep backend

# Verificar que ambos contenedores están en la misma red
docker network inspect noname_network

# Verificar variables de entorno
docker exec noname_frontend env | grep VITE_API_URL
```

#### Los cambios no se reflejan

```bash
# Verificar que el volumen está montado correctamente
docker inspect noname_frontend | grep -A 10 Mounts

# Reiniciar el contenedor
docker-compose restart frontend

# Si persiste, reconstruir
docker-compose down
docker-compose up -d --build
```

#### Puerto 5173 en uso

Edita `docker-compose.yml` y cambia el puerto:

```yaml
ports:
  - "5174:5173" # Cambiar 5173 por el puerto disponible
```

#### Limpiar recursos de Docker

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Limpieza completa (¡cuidado!)
docker system prune -a
```

### Configuración Avanzada

#### Construir para Producción

```bash
# Dentro del contenedor
docker exec -it noname_frontend npm run build

# O crear un Dockerfile específico para producción
```

#### Variables de Entorno Personalizadas

Puedes añadir más variables en `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=development
  - VITE_API_URL=http://localhost:90/api
  - VITE_CUSTOM_VAR=tu_valor
```

#### Debugging

```bash
# Entrar al contenedor
docker exec -it noname_frontend sh

# Ver procesos corriendo
ps aux

# Ver logs de Node.js
npm run dev
```

---

## ⚙️ Configuración

### Configuración de Vite (`vite.config.js`)

```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:90",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

### Configuración de API (`src/config/config.js`)

```javascript
export const API_CONFIG = {
  URL: "http://127.0.0.1:90",
  API_URL: "http://127.0.0.1:90/api",
  TIMEOUT: 30000,
  HEADERS: {
    Accept: "application/json",
  },
};
```

### Configuración de Rutas

Las rutas están protegidas con guards de autenticación. Todas las rutas excepto `/auth/login` requieren token válido.

**Rutas principales:**

- `/` - Dashboard
- `/auth/login` - Login
- `/order/*` - Módulo de pedidos
- `/products/*` - Módulo de productos
- `/pharmacies/*` - Módulo de farmacias

---

## 🔌 Integración con Backend

### API Endpoints Principales

#### Autenticación

- `POST /sanctum/get-token` - Obtener token
- `POST /sanctum/verify-token` - Verificar token

#### Pedidos

- `POST /api/order/get-order` - Obtener pedido
- `POST /api/order/save-order` - Guardar pedido
- `POST /api/order/item-add` - Añadir producto
- `POST /api/order/item-remove` - Eliminar producto
- `POST /api/get/orders` - Listar pedidos
- `POST /api/get/orders-farm` - Pedidos por farmacia

#### Productos

- `POST /api/get/products` - Listar productos
- `POST /api/get/products-all` - Todos los productos
- `POST /api/product-update` - Actualizar producto

#### Farmacias

- `POST /api/get/pharmacies` - Listar farmacias
- `POST /api/search/pharmacy-search` - Buscar farmacia
- `POST /api/get/pharmacy` - Obtener farmacia por CIP13
- `POST /api/get/pharmacy-id` - Obtener farmacia por ID
- `POST /api/pharmacy-update` - Actualizar farmacia
- `POST /api/get/create-pharmacy` - Crear farmacia

### Headers Requeridos

```javascript
headers: {
    'Authorization': 'Bearer ${token}',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
}
```

---

## 🌐 Despliegue

### IIS (Internet Information Services)

El proyecto incluye archivos `web.config` para despliegue en IIS:

1. **Build del proyecto:**

```bash
npm run build
```

2. **Configurar IIS:**
   - Crear nuevo sitio web
   - Apuntar a carpeta `/dist`
   - Configurar Application Pool (.NET v4.5+)

3. **Configurar URL Rewrite:**
   - Instalar módulo URL Rewrite en IIS
   - El `web.config` incluido maneja las rutas SPA

### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:90;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🔒 Seguridad

- **Tokens JWT** con expiración (8 horas)
- **Guards de navegación** en todas las rutas protegidas
- **Validación de tokens** en cada petición
- **CORS** configurado en backend
- **Sanitización** de inputs
- **Protección CSRF** via Laravel Sanctum
- **HTTPS** recomendado en producción

---

## 📝 Convenciones de Código

- **Vue 3 Composition API** con `<script setup>`
- **Nomenclatura**: camelCase para variables, PascalCase para componentes
- **ESLint**: Configuración recomendada de Vue
- **Comentarios** en francés/español según contexto
- **Servicios** centralizados en `/services`
- **Rutas** definidas de forma declarativa

---

## 🐛 Manejo de Errores

El sistema incluye un servicio centralizado de manejo de errores (`errorHandlingService.js`) que:

- Captura errores de API
- Registra errores en consola
- Muestra notificaciones al usuario
- Incluye contexto (componente, acción)

---

## 📊 Características Técnicas Destacadas

### Performance

- **Lazy loading** de componentes
- **Code splitting** automático con Vite
- **Tree shaking** para optimización de bundle
- **HMR** para desarrollo rápido

### UX/UI

- **Responsive design** (mobile-first)
- **Feedback visual** en todas las acciones
- **Loading states** en operaciones asíncronas
- **Validación** en tiempo real de formularios

### Datos

- **Paginación** server-side
- **Búsqueda** con debounce
- **Cache** de datos cuando aplica
- **Optimistic updates** en algunas operaciones

---

## 📚 Dependencias Principales

```json
{
  "dependencies": {
    "vue": "^3.5.13",
    "vue-router": "^4.5.0",
    "axios": "^1.8.1",
    "bootstrap": "^5.3.6",
    "xlsx": "^0.18.5",
    "@unhead/vue": "^2.0.10"
  },
  "devDependencies": {
    "vite": "^6.2.0",
    "@vitejs/plugin-vue": "^5.2.1"
  }
}
```

---

## 🔄 Flujo de Trabajo Típico

### Crear un Pedido

1. Usuario accede a `/order`
2. Busca farmacia por CIP13 o teléfono
3. Selecciona farmacia de resultados
4. Sistema carga datos de farmacia
5. Usuario añade productos al pedido
6. Sistema valida cantidades (min/max)
7. Usuario confirma pedido
8. Sistema guarda y muestra confirmación

### Actualizar Stocks Masivamente

1. Usuario accede a `/products/stocks`
2. Hace clic en "Importar Excel"
3. Selecciona archivo `.xlsx`
4. Sistema valida formato y datos
5. Muestra errores si los hay
6. Procesa datos válidos
7. Actualiza productos en base de datos
8. Muestra resultado de la operación

---

## 🤝 Soporte y Contacto

Para soporte técnico o consultas sobre el proyecto, contactar con el equipo de desarrollo.

---

## 📄 Licencia

Este proyecto es propiedad de NoName. Todos los derechos reservados.

---

## 🎉 Características Futuras Potenciales

- [ ] Dashboard con gráficas y estadísticas
- [ ] Reportes PDF de pedidos
- [ ] Sistema de notificaciones push
- [ ] Historial de cambios en productos
- [ ] Exportación de pedidos a diferentes formatos
- [ ] Integración con ERP
- [ ] App móvil nativa
- [ ] Sistema de roles y permisos granular

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0
The system uses JWT token-based authentication:

- Tokens are stored in localStorage
- All protected routes require authentication
- Token expiration is verified on each navigation

## Project Structure

```
noName-frontend/
├── public/
│   ├── css/
│   ├── js/
│   └── vendor/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── plugins/
│   ├── router/
│   ├── services/
│   └── views/
```

### Main Directories

- `public/`: Static files and assets
- `src/components/`: Reusable Vue components
- `src/layouts/`: Main layouts (MainLayout, SimpleLayout)
- `src/plugins/`: Vue plugins (error handling)
- `src/router/`: Route configuration
- `src/services/`: API services and utilities
- `src/views/`: Page components

## Main Features

### Routing System

The system implements two main layouts:

- `SimpleLayout`: For public pages (login)
- `MainLayout`: For authenticated pages

Main routes:

- `/`: Home page
- `/login`: Authentication
- `/home`: Main dashboard
- `/order/*`: Order management
- `/view/products`: Product catalog
- `/language/{en|es|fr}`: Multilanguage support

### Error Handling

Centralized error handling system that:

- Captures errors throughout the application
- Sends email notifications
- Records contextual information
- Includes stack trace and line number

### Security

- JWT-based authentication
- Token expiration verification
- Protected routes
- Security headers in API requests

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Production preview
npm run preview
```

## Style and UI

The project uses:

- SB Admin 2 as base theme
- Font Awesome for icons
- DataTables for interactive tables
- jQuery UI for additional components

## Maintenance

### Logging System

Errors are logged in:

- Email notification system
- Backend API

### Nice codes

```bash
context.component
context.action
```

```bash
if (import.meta.env.DEV) {
    console.group('Error Details');
    console.error('Message:', error.message);
    console.error('Location:', errorLocation);
    console.error('Component:', context.component);
    console.error('Action:', context.action);
    console.error('Full Stack:', error.stack);
    console.groupEnd();
}
```
