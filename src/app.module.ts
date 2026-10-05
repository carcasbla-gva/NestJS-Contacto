import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './contactos/entities/contacto.entity.js';
import { ContactosModule } from './contactos/contactos.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root', // <-- Cambia esto
      password: 'root', // <-- Cambia esto
      database: 'contactos_db', // <-- Cambia esto
      entities: [Contacto],
      synchronize: true, // Automáticamente crea la tabla si no existe
    }),
    ContactosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
