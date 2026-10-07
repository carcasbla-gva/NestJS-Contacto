import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Res,
  Req,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContactosService } from './contactos.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import type { Request, Response } from 'express';

@Controller('contactos')
@UseGuards(AuthGuard)
export class ContactosController {
  constructor(private readonly contactosService: ContactosService) {}

  @Get()
  @Render('inicio')
  async findAll(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'ASC' | 'DESC',
    @Query('search') search?: string,
    @Query('importados') importados?: string,
    @Query('error') error?: string,
  ) {
    const user = (req.session as any)?.user;
    const data = await this.contactosService.findPaginated({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      sortBy,
      order,
      search,
    });

    return {
      ...data,
      user,
      mensajeImportados: importados ? `Se han importado ${importados} contacto(s) correctamente.` : null,
      mensajeError: error || null,
    };
  }

  // Exportar contactos en formato CSV
  @Get('exportar/csv')
  async exportarCSV(@Res() res: Response) {
    const csvContent = await this.contactosService.exportarCSV();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="contactos.csv"');
    return res.send(csvContent);
  }

  // Importar contactos desde archivo CSV
  @Post('importar/csv')
  @UseInterceptors(FileInterceptor('archivo'))
  async importarCSV(@UploadedFile() file: any, @Res() res: Response) {
    if (!file || !file.buffer) {
      return res.redirect('/contactos?error=Debes seleccionar un archivo CSV para importar');
    }

    try {
      const contenido = file.buffer.toString('utf-8');
      const importados = await this.contactosService.importarCSV(contenido);
      return res.redirect(`/contactos?importados=${importados}`);
    } catch (err: any) {
      return res.redirect(`/contactos?error=${encodeURIComponent(err.message || 'Error al procesar el archivo CSV')}`);
    }
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