import { Module } from '@nestjs/common';
import { ContactosService } from './contactos.service.js';
import { ContactosController } from './contactos.controller.js';

@Module({
  controllers: [ContactosController],
  providers: [ContactosService],
})
export class ContactosModule {}
