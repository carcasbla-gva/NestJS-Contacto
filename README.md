# 📇 Agenda - NestJS

Este proyecto es una aplicación web full-stack para la gestión de contactos (CRUD) llamada **Agenda**, desarrollada como práctica de programación en el lado del servidor. El objetivo ha sido migrar un proyecto tradicional y adaptarlo a un framework moderno utilizando arquitectura MVC y módulos ECMAScript (ESM).

## 🚀 Tecnologías y Características

- **Backend:** NestJS
- **Lenguaje:** TypeScript (ESM)
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Motor de Plantillas:** EJS (HTML/CSS)
- **Autenticación:** `express-session` con encriptación `bcrypt` y protección mediante `AuthGuard`
- **UI/UX:** Diseño responsivo, navegación interactiva por botones, buscador en tiempo real y **Modo Oscuro / Modo Claro** con persistencia en `localStorage`


## 🧠 ¿Cómo funciona NestJS? (Guía rápida)

Para quienes nunca han trabajado con NestJS, se trata de un framework para Node.js que obliga a escribir código muy limpio y estructurado. Su arquitectura está fuertemente inspirada en Angular, basándose en la **Inyección de Dependencias** y separando las responsabilidades en tres piezas clave:

1. **Módulos (`*.module.ts`):** 
   Son los bloques organizativos de la aplicación. Cada característica (por ejemplo, `ContactosModule` y `AuthModule`) agrupa sus controladores y servicios, manteniendo el código aislado y ordenado.

2. **Controladores (`*.controller.ts`):** 
   Actúan como los "recepcionistas" de la aplicación. Se encargan de escuchar las peticiones HTTP que llegan desde el navegador (como un `GET` para ver una página o un `POST` al enviar un formulario). No procesan datos complejos; delegan el trabajo al Servicio y renderizan las vistas HTML con EJS.

3. **Servicios / Providers (`*.service.ts`):** 
   Aquí es donde reside la "lógica de negocio". El servicio realiza las tareas pesadas: comunicarse con la base de datos (usando TypeORM), validar credenciales, hashear contraseñas y aplicar las reglas de la aplicación.

4. **Guards (`*.guard.ts`):**
   Interrumpen las peticiones antes de llegar al controlador si no se cumplen ciertos requisitos (por ejemplo, `AuthGuard` comprueba si el usuario ha iniciado sesión antes de permitir el acceso a `/contactos`).

**El flujo básico de este proyecto es:**
El usuario entra a `/contactos` ➡️ El **Guard** verifica la sesión (si no hay, redirige a `/login`) ➡️ El **Controlador** intercepta la petición ➡️ Pide al **Servicio** que busque los contactos en PostgreSQL ➡️ El Servicio se los devuelve ➡️ El Controlador se los pasa a la vista `.ejs` con los datos del usuario conectado.

## 🔐 Módulo de Autenticación

- **/login (GET/POST):** Formulario e inicio de sesión con verificación de contraseña segura con `bcrypt`.
- **/registro (GET/POST):** Registro de nuevos usuarios con almacenamiento seguro.
- **/logout (GET):** Cierre de sesión y destrucción de la sesión activa en el servidor.
- **/contactos (CRUD):** Rutas protegidas mediante `AuthGuard`.

## 🗄️ Configuración de la Base de Datos (PostgreSQL)

Para que el ORM de NestJS (TypeORM) pueda conectarse y crear las tablas automáticamente, es necesario que el motor de base de datos esté instalado y configurado en Ubuntu.

**1. Instalación del Motor**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
```

**2. Creación del Usuario y la Base de Datos**
Accede a la consola de administración de PostgreSQL:
```bash
sudo -u postgres psql
```

Dentro de la consola SQL, ejecuta las siguientes instrucciones para preparar el entorno:
```sql
CREATE DATABASE contactos_db;
CREATE USER root WITH ENCRYPTED PASSWORD 'root';
ALTER DATABASE contactos_db OWNER TO root;
\q
```
*Nota: Gracias a la propiedad `synchronize: true` en TypeORM, no es necesario ejecutar migraciones manuales; el framework lee las entidades (`Contacto` y `Usuario`) y genera las tablas automáticamente al arrancar.*

## ⚙️ Instalación y Despliegue

1. **Instalar las dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run start:dev
   ```

3. **Acceder a la aplicación:**
   Abre tu navegador web y visita: [http://localhost:3000](http://localhost:3000) (redirigirá automáticamente a `/login` si no has iniciado sesión).

## 📚 Documentación Adicional

- 🔐 [Detalle de Autenticación, Seguridad y Rediseño de UI](./autenticacion_y_diseno.md) (o consulta [autenticacion_y_diseno.md](file:///home/alumno/Documentos/nest-js-contacto/autenticacion_y_diseno.md))
- 📄 [Configuración de la Base de Datos PostgreSQL](./configuracion_bbdd.md) (o consulta [configuracion_bbdd.md](file:///home/alumno/Documentos/nest-js-contacto/configuracion_bbdd.md))


## 👨‍🏫 Notas para el profesor (Víctor Ponz)

Hola Víctor, en el siguiente enlace puedes ver el historial completo de la conversación y el proceso de razonamiento guiado mediante IA para estructurar, configurar y programar la práctica:

🔗 **[Historial del proceso de desarrollo](https://share.gemini.google/itUE91X5TOA0)**

---
*Desarrollado por Carlos Javier Castaños Blanco - 2º DAW*