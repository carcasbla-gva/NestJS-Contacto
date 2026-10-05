import { Controller, Get, Post, Body, Render, Res, Param } from '@nestjs/common';
import { ContactosService } from './contactos.service.js';
import express from 'express';

@Controller('contactos')
export class ContactosController {
  constructor(private readonly contactosService: ContactosService) {}

  @Get()
  @Render('inicio')
  async findAll() {
    const contactos = await this.contactosService.findAll();
    return { contactos }; 
  }

  @Get('nuevo')
  @Render('nuevo_contacto')
  nuevoForm() {
    return {};
  }

  @Post('nuevo')
  async create(@Body() body: any, @Res() res: express.Response) {
    await this.contactosService.create(body);
    return res.redirect('/contactos');
  }

  // NUEVO: Mostrar el formulario de edición con los datos rellenos
  @Get('editar/:id')
  @Render('editar_contacto')
  async editarForm(@Param('id') id: string) {
    const contacto = await this.contactosService.findOne(+id);
    return { contacto };
  }

  // NUEVO: Recibir los datos editados y guardarlos
  @Post('editar/:id')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: express.Response) {
    await this.contactosService.update(+id, body);
    return res.redirect('/contactos');
  }

  // NUEVO: Eliminar el contacto
  @Post('eliminar/:id')
  async remove(@Param('id') id: string, @Res() res: express.Response) {
    await this.contactosService.remove(+id);
    return res.redirect('/contactos');
  }
}