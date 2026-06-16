# 🐾 Sanos y Salvos — Frontend Portal

Aplicación web React para la plataforma **Sanos y Salvos**: permite a ciudadanos registrar mascotas perdidas, reportar avistamientos geolocalizados y visualizar coincidencias calculadas por el motor espacial del backend.

---

## 🖥️ Tecnologías

- **React 18** + Create React App
- **React Router DOM** — navegación entre páginas y rutas protegidas
- **React Leaflet** + **OpenStreetMap (OSM)** — mapas interactivos para geolocalización
- **Axios** — cliente HTTP con interceptores automáticos de JWT
- **Context API** — gestión de estado de autenticación global

---

## ✨ Características Principales

### 🗺️ Mapas Interactivos
- Los formularios de **Registrar Mascota** y **Reportar Avistamiento** incluyen un mapa de React Leaflet donde el usuario hace clic o arrastra un marcador para seleccionar coordenadas exactas
- El mapa público principal muestra todos los avistamientos reportados con marcadores geolocalizados
- Los tiles del mapa se sirven desde los servidores públicos de **OpenStreetMap**

### 🔍 Motor de Coincidencias (Matches)
- Panel **Buzón de Coincidencias** con pestañas de pendientes y aceptadas
- Cada coincidencia muestra porcentaje de similitud calculado por la **Fórmula de Haversine** en el backend
- Modal de detalle con foto de la mascota, datos del avistamiento y información de contacto del reportador
- Acciones para **aceptar** o **descartar** coincidencias directamente desde el panel

### 🔐 Seguridad con JWT
- Al iniciar sesión, el token JWT se almacena en `localStorage`
- Interceptor de Axios agrega automáticamente el header `Authorization: Bearer <token>` en cada petición
- Si el backend responde con `401`, el interceptor limpia la sesión y redirige al login automáticamente
- Rutas protegidas con `ProtectedRoute`: redirige a `/login` si no hay sesión, y a `/dashboard` si no tiene rol admin

### 👤 Auto-login tras registro
- Al completar el registro, el sistema hace login automático con las credenciales ingresadas y redirige directamente al dashboard, sin pasar por el formulario de login

### 🛡️ Panel Administrador
- Vista exclusiva para usuarios con rol `ADMINISTRADOR`
- Gestión de usuarios: listado y eliminación
- Visualización de coincidencias pendientes con capacidad de aprobar o descartar

---

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── MapaInteractivo.js     # Mapa OSM con marcadores dinámicos (solo lectura)
│   ├── MatchDetalleModal.js   # Modal de detalle de coincidencia
│   └── ProtectedRoute.js      # Guardia de rutas privadas y de admin
├── context/
│   └── AuthContext.js         # Estado global de autenticación (user, token, rol)
├── pages/
│   ├── Home.js                # Página principal con mapa público y secciones
│   ├── Login.js               # Formulario de login + decodificación JWT
│   ├── Register.js            # Registro + auto-login automático
│   ├── Mascotas.js            # Listado público de mascotas
│   ├── MascotaDetalle.js      # Detalle de mascota por ID
│   ├── RegistrarMascota.js    # Formulario con mapa para registrar mascota
│   ├── ReportarAvistamiento.js # Formulario con mapa para reportar avistamiento
│   ├── UserDashboard.js       # Panel del usuario autenticado
│   ├── AdminDashboard.js      # Panel administrador
│   └── BuzonCoincidencias.js  # Panel de matches con modal de detalle
├── services/
│   └── api.js                 # Servicios Axios por microservicio
└── utils/
    └── avistamientoUtils.js   # Helpers de formato para ubicación y fecha
```

---

## ⚙️ Configuración de Entorno

La app se conecta al **API Gateway** en el puerto `8080`. Toda petición pasa por él — nunca se llama directamente a un microservicio.

Por defecto apunta a:
```
http://localhost:8080/api
```

Para cambiar la URL base (opcional), crea un archivo `.env` en la raíz del proyecto:

```bash
REACT_APP_API_URL=http://localhost:8080/api
```

> ⚠️ El backend debe estar corriendo antes de iniciar el frontend. Ver instrucciones en `Sanos-y-Salvos-System/README.md`.

---

## 🚀 Instalación y Ejecución

### Prerrequisitos

- [Node.js LTS](https://nodejs.org/) (v18 o superior recomendado)
- Backend corriendo en `http://localhost:8080`

### Instalar dependencias

```bash
npm install
```

### Iniciar en modo desarrollo

```bash
npm start
```

Abre la aplicación en: **http://localhost:3000**

### Build de producción

```bash
npm run build
```

Genera la carpeta `build/` lista para despliegue estático.

---

## 🗺️ Rutas de la Aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Página principal con mapa y secciones |
| `/mascotas` | Público | Listado de todas las mascotas |
| `/mascotas/:id` | Público | Detalle de una mascota |
| `/registrar-mascota` | Autenticado | Formulario con mapa para registrar mascota |
| `/reportar-avistamiento` | Público | Formulario con mapa para reportar avistamiento |
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de usuario |
| `/dashboard` | Autenticado | Panel del usuario con sus mascotas |
| `/coincidencias` | Autenticado | Buzón de coincidencias (matches) |
| `/admin` | Solo ADMINISTRADOR | Panel de administración |

---

## 🔗 Servicios del Backend consumidos

Definidos en `src/services/api.js`:

| Servicio | Métodos |
|---|---|
| `authService` | `login`, `register` |
| `mascotaService` | `registrar`, `getLista`, `getById`, `getByUsuario` |
| `geolocalizacionService` | `registrarUbicacion`, `getMapaPublico` |
| `reportesService` | `reportarAvistamiento`, `getAvistamientosRecientes` |
| `coincidenciasService` | `getCoincidenciasPendientes`, `actualizarEstadoCoincidencia` |
| `usuarioService` | `getLista`, `eliminar` |
