import { Controller, Get, Post, Body, Render, Res } from '@nestjs/common';
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
}