# Historial de Desarrollo y Conversación con el Asistente IA

Este documento recopila de forma cronológica y estructurada todas las peticiones, decisiones técnicas y desarrollos realizados paso a paso en el proyecto **Agenda (NestJS)**.

---

## 1. Petición Inicial: Sistema de Inicio de Sesión y Autenticación

### Requerimiento del usuario
> *"ahora tenemos que añadir que se tenga que iniciar sesion"*

### Decisiones y Análisis Técnico
Para una aplicación MVC con renderizado en el servidor mediante plantillas EJS, se optó por la arquitectura estándar y segura:
- **Gestión de sesiones:** Middleware `express-session` con cookies HTTP de sesión persistentes.
- **Seguridad y contraseñas:** Encriptación y hasheo mediante `bcrypt` con 10 rondas de salting.
- **Persistencia:** Tabla `usuarios` en PostgreSQL gestionada por TypeORM con sincronización automática.

### Pasos ejecutados
1. **Instalación de dependencias:**
   ```bash
   npm install express-session bcrypt
   npm install -D @types/express-session @types/bcrypt
   ```

2. **Creación de la entidad `Usuario` (`src/auth/entities/usuario.entity.ts`):**
   - Definición de columnas: `id` (autonumérico), `username` (único), `nombre` y `password` (hash).

3. **Desarrollo de `AuthService` (`src/auth/auth.service.ts`):**
   - `registrar(username, nombre, password)`: Comprueba unicidad y genera el hash con `bcrypt.hash()`.
   - `validar(username, password)`: Comprueba la existencia del usuario y valida con `bcrypt.compare()`.

4. **Creación del Guard `AuthGuard` (`src/auth/guards/auth.guard.ts`):**
   - Implementa `CanActivate` comprobando `req.session.user`.
   - Si no existe sesión activa, redirige automáticamente a la ruta pública `/login`.

5. **Desarrollo de `AuthController` (`src/auth/auth.controller.ts`):**
   - `GET /login`: Renderiza la vista de login con soporte de mensajes de error o confirmación.
   - `POST /login`: Valida credenciales y establece `req.session.user`.
   - `GET /registro`: Muestra el formulario para crear una nueva cuenta.
   - `POST /registro`: Procesa el alta de nuevos usuarios.
   - `GET /logout`: Destruye la sesión en el servidor y redirige a `/login`.

6. **Configuración global en `main.ts`, `app.module.ts` y `app.controller.ts`:**
   - Registro del middleware de sesión en Express.
   - Inclusión de `AuthModule` y la entidad `Usuario` en TypeORM.
   - Redirección de la raíz `/` a `/contactos` (si está logueado) o `/login` (si no lo está).

7. **Protección de `ContactosController`:**
   - Aplicación del decorador `@UseGuards(AuthGuard)` a nivel de clase para proteger todas las operaciones CRUD.

---

## 2. Segunda Petición: Navegación por Botones y Rediseño Visual (UI/UX)

### Requerimiento del usuario
> *"Pero que se pueda acceder a las rutas desde botones para que sea mas facil de acceder no cambiando desde la URL y mejora el diseño porfa"*

### Decisiones y Análisis Técnico
Para evitar que el usuario tenga que escribir manualmente rutas en la barra de direcciones del navegador, se implementó un sistema de navegación completo e intuitivo mediante botones y enlaces visuales:
- **Barra de navegación global (Navbar):** Cabecera fija presente en todas las vistas protegidas con enlaces a `Contactos`, `+ Nuevo`, píldora con nombre y avatar del usuario activo, y botón directo para `Cerrar Sesión`.
- **Pestañas de acceso rápido en Login y Registro:** Pestañas interactivas para alternar entre iniciar sesión y registrarse en 1 clic.
- **Acciones en formularios:** Botones `Volver a Contactos` y `Cancelar` en las pantallas de creación y edición.
- **Buscador en tiempo real:** Cuadro de búsqueda interactivo en JavaScript que filtra la tabla de contactos al instante sin recargar la página.
- **Sistema de diseño moderno:** Integración de la tipografía *Plus Jakarta Sans*, tarjetas con elevación suave, bordes redondeados y efectos interactivos en hover.

---

## 3. Tercera Petición: Nombre "Agenda" y Modo Oscuro / Modo Claro

### Requerimiento del usuario
> *"y el nombre se llama agenda y ponle tambien un boton de modo oscuro y modo claro"*

### Decisiones y Análisis Técnico
Se unificó la identidad visual de la aplicación bajo el nombre **Agenda** y se añadió un conmutador completo de tema claro/oscuro:
- **Variables CSS dinámicas (`public/css/estilos.css`):** Definición de paletas de color completas para `:root` (modo claro) y `[data-theme="dark"]` (modo oscuro con fondos oscuros, tarjetas contrastadas y textos legibles).
- **Controlador de tema en JavaScript (`public/js/theme.js`):** 
  - Detecta la preferencia del sistema operativo del usuario.
  - Guarda la selección en `localStorage` para que la preferencia se mantenga al recargar o navegar entre páginas.
  - Previene el parpadeo de color (*FOUC*) al cargar el tema antes de pintar el DOM.
- **Botones conmutadores:**
  - Botón integrado en la Navbar en todas las páginas de la agenda.
  - Botón flotante accesible en las pantallas de Login y Registro.

---

## 4. Cuarta Petición: Eliminación de Todos los Emojis

### Requerimiento del usuario
> *"y quita todos los emojis"*

### Decisiones y Análisis Técnico
Se eliminaron todos los caracteres emoji de las plantillas HTML (EJS), scripts y estilos, sustituyéndolos por:
- **Iconos vectoriales SVG:** Iconos SVG de trazo limpio y minimalista para el logotipo de la agenda, la lupa del buscador y los iconos de sol/luna del conmutador de tema.
- **Texto descriptivo claro:** Botones y enlaces con etiquetas directas (*Contactos*, *+ Nuevo*, *Guardar Contacto*, *Guardar Cambios*, *Cancelar*, *Editar*, *Eliminar*, *Cerrar Sesión*).
- **Campos de formulario limpios:** Formularios sobrios y legibles sin iconos superfluos.

---

## 5. Resumen de la Estructura Final del Proyecto

- **`src/auth/`**: Módulo de autenticación (entidad de usuario, servicio con bcrypt, controlador y guard).
- **`src/contactos/`**: Módulo CRUD de contactos protegido con `AuthGuard`.
- **`views/`**: Plantillas EJS responsivas (`inicio.ejs`, `nuevo_contacto.ejs`, `editar_contacto.ejs`, `login.ejs`, `registro.ejs`).
- **`public/css/estilos.css`**: Sistema de diseño responsivo con soporte para modo claro y modo oscuro.
- **`public/js/theme.js`**: Lógica de persistencia de tema en `localStorage` con iconos SVG.
- **`src/main.ts`**: Inicialización de NestJS con soporte de plantillas EJS y sesiones HTTP.
