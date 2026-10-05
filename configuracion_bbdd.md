# Configuración de la Base de Datos (PostgreSQL)

Para que el ORM de NestJS (TypeORM) pueda conectarse y crear las tablas automáticamente, es necesario que el motor de base de datos esté instalado y configurado en el sistema operativo (en este caso, Ubuntu).

A continuación se detallan los pasos necesarios para levantar el entorno desde cero:

## 1. Instalación del Motor
Primero, instalamos PostgreSQL desde los repositorios oficiales de Ubuntu y nos aseguramos de que el servicio esté iniciado:
\`\`\`bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
\`\`\`

## 2. Creación del Usuario y la Base de Datos
Accedemos a la consola de administración de PostgreSQL con el usuario por defecto del sistema:
\`\`\`bash
sudo -u postgres psql
\`\`\`

Dentro de la consola SQL, ejecutamos las siguientes instrucciones para preparar el entorno que coincida con las credenciales de nuestro `app.module.ts`:
\`\`\`sql
-- 1. Crear la base de datos
CREATE DATABASE contactos_db;

-- 2. Crear un usuario con contraseña
CREATE USER root WITH ENCRYPTED PASSWORD 'root';

-- 3. Darle permisos absolutos sobre la base de datos al nuevo usuario
ALTER DATABASE contactos_db OWNER TO root;

-- 4. Salir de la consola
\q
\`\`\`

## 3. Sincronización Automática
Una vez configurado el motor, NestJS se conecta utilizando el driver `pg`. Gracias a la propiedad `synchronize: true` en la configuración de TypeORM, no es necesario ejecutar migraciones manuales; el framework lee nuestra entidad `Contacto` y genera o actualiza la tabla en PostgreSQL automáticamente cada vez que arranca el servidor.