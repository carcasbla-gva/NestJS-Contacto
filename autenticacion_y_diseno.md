# 🔐 Documentación: Autenticación, Control de Acceso, Modo Oscuro/Claro y Rediseño de UI

Este documento detalla todas las funcionalidades, módulos y mejoras visuales implementadas en la aplicación **Agenda (NestJS)**.

---

## 📌 Resumen de Cambios

En esta etapa se ha dotado a la aplicación de:
1. **Sistema completo de autenticación y sesiones de usuario:** Registro, inicio de sesión seguro con contraseñas encriptadas en PostgreSQL y cierre de sesión.
2. **Protección de rutas con Guards:** Redirección automática a la pantalla de login si se intenta acceder a la gestión de contactos sin haber iniciado sesión.
3. **Modo Oscuro / Modo Claro:** Conmutador de tema con persistencia en `localStorage` disponible en toda la aplicación.
4. **Rediseño completo de la interfaz de usuario (UI/UX):** Navegación fluida por botones (sin depender de la barra de direcciones del navegador), buscador en tiempo real, avatares dinámicos y diseño limpio con iconos vectoriales SVG (sin emojis).
5. **Paginación y Ordenación:** Paginación configurable (5, 10, 20, 50 por página) con cálculo de páginas y ordenación interactiva ascendente/descendente al hacer clic en las cabeceras de la tabla.
6. **Exportación e Importación de Contactos (CSV):** Descarga directa de la agenda en formato CSV compatible con Excel/LibreOffice y modal para importar contactos por lotes.





---

## 🛠️ 1. Sistema de Autenticación y Seguridad

### 📦 Dependencias Instaladas
```bash
npm install express-session bcrypt
npm install -D @types/express-session @types/bcrypt
```

### 🗄️ Entidad `Usuario` (`src/auth/entities/usuario.entity.ts`)
Se ha definido la entidad `Usuario` mapeada en PostgreSQL mediante TypeORM:
- **`id`**: Clave primaria autonumérica.
- **`username`**: Nombre de usuario único para el inicio de sesión.
- **`nombre`**: Nombre completo del usuario visible en la aplicación.
- **`password`**: Hash seguro de la contraseña generado con `bcrypt`.

### ⚙️ Servicio de Autenticación (`src/auth/auth.service.ts`)
Encapsula la lógica de negocio y seguridad:
- **`registrar(username, nombre, password)`**: Valida que el nombre de usuario no esté duplicado y genera el hash de la contraseña usando `bcrypt.hash(password, 10)` antes de persistirla en la base de datos.
- **`validar(username, password)`**: Comprueba la existencia del usuario y compara la contraseña introducida con el hash almacenado mediante `bcrypt.compare`.

### 🛡️ Guard de Autenticación (`src/auth/guards/auth.guard.ts`)
Implementa la interfaz `CanActivate` de NestJS:
- Comprueba si existe la propiedad `user` dentro de la sesión HTTP (`req.session.user`).
- Si el usuario no ha iniciado sesión, intercepta la petición y lo redirige automáticamente a `/login`.

### 🌐 Controlador de Autenticación (`src/auth/auth.controller.ts`)
Gestiona las rutas públicas y de control de sesión:
- **`GET /login`**: Muestra la vista de inicio de sesión con mensajes contextuales de error o éxito.
- **`POST /login`**: Valida credenciales, asigna el usuario a `req.session.user` y redirige a `/contactos`.
- **`GET /registro`**: Muestra el formulario para crear una nueva cuenta.
- **`POST /registro`**: Registra al nuevo usuario y redirige al login con notificación de confirmación.
- **`GET /logout`**: Destruye la sesión activa en el servidor (`req.session.destroy`) y devuelve al usuario a `/login`.

### 🔌 Configuración Global de Sesiones (`src/main.ts`)
Se integró el middleware `express-session`:
```typescript
app.use(
  session({
    secret: 'nest_contacto_secreto_super_seguro_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 día de persistencia
    },
  }),
);
```

---

## 🎨 2. Rediseño Visual y Navegación por Botones (UI/UX)

Se ha eliminado la necesidad de escribir URLs manualmente en el navegador, sustituyéndolo por un sistema de navegación interactivo y accesible.

### 🧭 Navegación Global (Navbar)
Presente en todas las vistas protegidas:
- **Logotipo interactivo:** Enlace directo a la lista principal (`/contactos`).
- **Botón `📋 Contactos`:** Acceso directo a la agenda.
- **Botón `➕ Nuevo`:** Acceso inmediato al formulario de alta de contactos.
- **Píldora de usuario:** Muestra un avatar con las iniciales del usuario y su nombre real.
- **Botón `🚪 Salir`:** Cierre de sesión inmediato con un solo clic.

### 🔀 Alternancia Rápida entre Login y Registro
- Ambas pantallas cuentan con pestañas superiores (`🔑 Iniciar Sesión` y `📝 Crear Cuenta`) para cambiar de vista cómodamente.

### ⚡ Buscador en Tiempo Real
- En la vista principal (`inicio.ejs`) se ha añadido un buscador que filtra los contactos al escribir, actualizando el conteo de registros visibles al instante mediante JavaScript.

### 📋 Acciones por Contacto
- **Avatar generado por iniciales:** Círculo con gradiente para identificar visualmente cada contacto.
- **Enlaces directos:** Enlaces `tel:` y `mailto:` para llamar o escribir con un clic.
- **Botones `✏️ Editar` y `🗑️ Eliminar`:** Acciones directas con ventana de confirmación previa al borrado.
- **Estado vacío:** Mensaje ilustrado con botón `➕ Añadir mi primer contacto` si no hay registros.

### 📝 Formularios Claros con Botones de Retorno
- En las vistas de **Crear** y **Editar** contacto se incluyen:
  - Botón superior `⬅ Volver a Contactos`.
  - Botón `❌ Cancelar` al pie del formulario para abortar la edición.
  - Campos con iconos ilustrativos (`👤`, `👥`, `📞`, `✉️`, `🔒`).

---

## 📁 3. Resumen de Archivos Creados y Modificados

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| `src/auth/entities/usuario.entity.ts` | **Creado** | Entidad TypeORM para la tabla de usuarios en PostgreSQL. |
| `src/auth/auth.service.ts` | **Creado** | Servicio con encriptación `bcrypt` y validación de credenciales. |
| `src/auth/auth.controller.ts` | **Creado** | Controlador para login, registro y logout. |
| `src/auth/guards/auth.guard.ts` | **Creado** | Guard de protección de rutas privadas. |
| `src/auth/auth.module.ts` | **Creado** | Módulo de autenticación de NestJS. |
| `views/login.ejs` | **Creado** | Vista de login con pestañas y alertas. |
| `public/js/theme.js` | **Creado** | Lógica de detección y persistencia de tema claro/oscuro en `localStorage`. |
| `src/main.ts` | **Modificado** | Configuración del middleware de sesiones (`express-session`). |
| `src/app.module.ts` | **Modificado** | Registro de `AuthModule` y la entidad `Usuario`. |
| `src/app.controller.ts` | **Modificado** | Redirección de la raíz `/` a `/contactos` o `/login`. |
| `src/contactos/contactos.controller.ts` | **Modificado** | Protección con `@UseGuards(AuthGuard)` y paso de datos de sesión. |
| `views/inicio.ejs` | **Modificado** | Rediseño con navbar, buscador, avatares y botones. |
| `views/nuevo_contacto.ejs` | **Modificado** | Rediseño con navbar y botón cancelar. |
| `views/editar_contacto.ejs` | **Modificado** | Rediseño con navbar y botón cancelar. |
| `public/css/estilos.css` | **Modificado** | Sistema de diseño completo con soporte nativo de modo oscuro/claro. |



---

## 🚀 4. Guía de Prueba Rápida

1. Iniciar la aplicación con `npm run start:dev`.
2. Acceder a `http://localhost:3000`.
3. Al no estar autenticado, serás redirigido a `http://localhost:3000/login`.
4. Pulsar en la pestaña **"📝 Crear Cuenta"** y registrar un usuario de prueba.
5. Iniciar sesión con el usuario y contraseña creados.
6. Interactuar con la agenda de contactos utilizando únicamente los botones y la barra de navegación superior.
7. Pulsar el botón **"🚪 Salir"** para cerrar sesión y comprobar que el acceso a `/contactos` vuelve a quedar bloqueado.
