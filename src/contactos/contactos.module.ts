import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactosService } from './contactos.service.js';
import { ContactosController } from './contactos.controller.js';
import { Contacto } from './entities/contacto.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Contacto])],
  controllers: [ContactosController],
  providers: [ContactosService],
})
export class ContactosModule {}