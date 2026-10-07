import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './contactos/entities/contacto.entity.js';
import { Usuario } from './auth/entities/usuario.entity.js';
import { ContactosModule } from './contactos/contactos.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'contactos_db',
      entities: [Contacto, Usuario],
      synchronize: true, // Crea automáticamente las tablas si no existen
    }),
    ContactosModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

