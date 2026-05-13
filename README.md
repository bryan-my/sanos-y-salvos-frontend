# Sanos y Salvos (Frontend)

Frontend web para **Sanos y Salvos**, una plataforma para **publicar, buscar y difundir reportes de mascotas perdidas o encontradas**.

## Stack

- React + Create React App
- React Router (rutas)
- Axios (consumo de API)

## Funcionalidades

- Inicio con acceso rápido a secciones y links de autenticación.
- Listado público de mascotas registradas.
- Detalle de mascota por ID.
- Registro de mascotas (requiere sesión).
- Panel de usuario: ver mascotas asociadas al usuario.
- Panel admin: listar usuarios, ver mascotas de un usuario y eliminar usuarios.

## Cómo corre (alto nivel)

- El enrutamiento se define en [App.js](src/App.js) con `react-router-dom`.
- La sesión se maneja con un contexto (AuthProvider) en [AuthContext.js](src/context/AuthContext.js).
  - Guarda `token` y `user` en `localStorage`.
  - Expone `isAuthenticated` e `isAdmin` (rol `ADMINISTRADOR`).
- Las rutas protegidas usan [ProtectedRoute.js](src/components/ProtectedRoute.js):
  - Si no hay sesión, redirige a `/login`.
  - Si `requireAdmin` y no es admin, redirige a `/dashboard`.
- La comunicación con el backend se centraliza en [api.js](src/services/api.js):
  - Axios con `baseURL`.
  - Interceptor que agrega `Authorization: Bearer <token>`.
  - Si el backend responde `401` y hay token, limpia sesión y redirige a `/login`.

## Endpoints usados

Definidos en [api.js](src/services/api.js) (prefijo `/api` por defecto):

- Auth
  - `POST /auth/login`
  - `POST /usuarios/registro`
- Usuarios (admin)
  - `GET /usuarios/lista`
  - `DELETE /usuarios/:id`
- Mascotas
  - `POST /mascotas`
  - `GET /mascotas/lista`
  - `GET /mascotas/usuario/:idUsuario`
  - `GET /mascotas/:id`

## Configuración de API

Por defecto, la app apunta a:

- `REACT_APP_API_URL` (si existe) o
- `http://localhost:8080/api`

Opcionalmente, podés setear `REACT_APP_API_URL` (Create React App):

```bash
set REACT_APP_API_URL=http://localhost:8080/api
npm start
```

## Requisitos

- Node.js (LTS recomendado)
- Backend corriendo (por defecto en `http://localhost:8080`)

## Scripts

En la raíz del proyecto:

```bash
npm install
```

```bash
npm start
```

Abre la app en `http://localhost:3000`.

Build de producción:

```bash
npm run build
```

Tests:

```bash
npm test
```

## Estructura del proyecto (resumen)

- `src/pages/`: páginas (Home, Login, Register, Mascotas, Detalle, Dashboards).
- `src/context/`: contexto de autenticación.
- `src/services/`: cliente HTTP y servicios hacia el backend.
- `src/components/`: componentes reutilizables (rutas protegidas).
