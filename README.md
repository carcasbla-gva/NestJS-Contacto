# 📇 Gestor de Contactos - NestJS

Este proyecto es una aplicación web full-stack para la gestión de contactos (CRUD) desarrollada como práctica de programación en el lado del servidor. El objetivo ha sido migrar un proyecto tradicional y adaptarlo a un framework moderno utilizando arquitectura MVC y módulos ECMAScript (ESM).

## 🚀 Tecnologías Utilizadas

- **Backend:** NestJS
- **Lenguaje:** TypeScript (ESM)
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Motor de Plantillas:** EJS (HTML/CSS)

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

🔗 **[Historial del proceso de desarrollo](https://share.gemini.google/vYq8MFobz2r1)**
---
*Desarrollado por Carlos Javier Castaños Blanco - 2º DAW*