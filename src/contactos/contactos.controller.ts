import { Controller, Get, Post, Body, Render, Res, Req, Param, UseGuards } from '@nestjs/common';
import { ContactosService } from './contactos.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import type { Request, Response } from 'express';


@Controller('contactos')
@UseGuards(AuthGuard)
export class ContactosController {
  constructor(private readonly contactosService: ContactosService) {}

  @Get()
  @Render('inicio')
  async findAll(@Req() req: Request) {
    const contactos = await this.contactosService.findAll();
    const user = (req.session as any)?.user;
    return { contactos, user }; 
  }

  @Get('nuevo')
  @Render('nuevo_contacto')
  nuevoForm(@Req() req: Request) {
    const user = (req.session as any)?.user;
    return { user };
  }

  @Post('nuevo')
  async create(@Body() body: any, @Res() res: Response) {
    await this.contactosService.create(body);
    return res.redirect('/contactos');
  }

  // Mostrar el formulario de edición con los datos rellenos
  @Get('editar/:id')
  @Render('editar_contacto')
  async editarForm(@Param('id') id: string, @Req() req: Request) {
    const contacto = await this.contactosService.findOne(+id);
    const user = (req.session as any)?.user;
    return { contacto, user };
  }

  // Recibir los datos editados y guardarlos
  @Post('editar/:id')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    await this.contactosService.update(+id, body);
    return res.redirect('/contactos');
  }

  // Eliminar el contacto
  @Post('eliminar/:id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.contactosService.remove(+id);
    return res.redirect('/contactos');
  }
}