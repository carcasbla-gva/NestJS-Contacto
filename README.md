# 📇 Gestor de Contactos - NestJS

Este proyecto es una aplicación web full-stack para la gestión de contactos (CRUD) desarrollada como práctica de programación en el lado del servidor. El objetivo ha sido migrar un proyecto tradicional y adaptarlo a un framework moderno utilizando arquitectura MVC y módulos ECMAScript (ESM).

## 🚀 Tecnologías Utilizadas

- **Backend:** NestJS
- **Lenguaje:** TypeScript (ESM)
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Motor de Plantillas:** EJS (HTML/CSS)

## 🧠 ¿Cómo funciona NestJS? (Guía rápida)

Para quienes nunca han trabajado con NestJS, se trata de un framework para Node.js que obliga a escribir código muy limpio y estructurado. Su arquitectura está fuertemente inspirada en Angular, basándose en la **Inyección de Dependencias** y separando las responsabilidades en tres piezas clave:

1. **Módulos (`*.module.ts`):** 
   Son los bloques organizativos de la aplicación. Cada característica (por ejemplo, los "Contactos") tiene su propio módulo que agrupa sus controladores y servicios, manteniendo el código aislado y ordenado.

2. **Controladores (`*.controller.ts`):** 
   Actúan como los "recepcionistas" de la aplicación. Se encargan de escuchar las peticiones HTTP que llegan desde el navegador (como un `GET` para ver una página o un `POST` al enviar un formulario). No procesan datos complejos; simplemente delegan el trabajo al Servicio y devuelven la respuesta (en nuestro caso, renderizan las vistas HTML con EJS).

3. **Servicios / Providers (`*.service.ts`):** 
   Aquí es donde reside la "lógica de negocio". El servicio es el trabajador real que realiza las tareas pesadas: comunicarse con la base de datos (usando TypeORM), validar información y aplicar las reglas de la aplicación.

**El flujo básico de este proyecto es:**
El usuario entra a `/contactos` ➡️ El **Controlador** intercepta la petición ➡️ Pide al **Servicio** que busque los contactos en PostgreSQL ➡️ El Servicio se los devuelve ➡️ El Controlador se los pasa a la vista `.ejs` para que el usuario los vea en pantalla.

## 🗄️ Configuración de la Base de Datos (PostgreSQL)

Para que el ORM de NestJS (TypeORM) pueda conectarse y crear las tablas automáticamente, es necesario que el motor de base de datos esté instalado y configurado en Ubuntu.

**1. Instalación del Motor**
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
\`\`\`

**2. Creación del Usuario y la Base de Datos**
Accede a la consola de administración de PostgreSQL:
\`\`\`bash
sudo -u postgres psql
\`\`\`

Dentro de la consola SQL, ejecuta las siguientes instrucciones para preparar el entorno:
\`\`\`sql
CREATE DATABASE contactos_db;
CREATE USER root WITH ENCRYPTED PASSWORD 'root';
ALTER DATABASE contactos_db OWNER TO root;
\q
\`\`\`
*Nota: Gracias a la propiedad `synchronize: true` en TypeORM, no es necesario ejecutar migraciones manuales; el framework lee la entidad y genera la tabla automáticamente al arrancar.*

## ⚙️ Instalación y Despliegue

1. **Instalar las dependencias del proyecto:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Iniciar el servidor en modo desarrollo:**
   \`\`\`bash
   npm run start:dev
   \`\`\`

3. **Acceder a la aplicación:**
   Abre tu navegador web y visita: [http://localhost:3000/contactos](http://localhost:3000/contactos)

## 👨‍🏫 Notas para el profesor (Víctor Ponz)

Hola Víctor, en el siguiente enlace puedes ver el historial completo de la conversación y el proceso de razonamiento guiado mediante IA para estructurar, configurar y programar la práctica:

🔗 **[Historial del proceso de desarrollo](https://share.gemini.google/itUE91X5TOA0)**

---
*Desarrollado por Carlos Javier Castaños Blanco - 2º DAW*