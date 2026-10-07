import { Controller, Get, Post, Body, Req, Res, Render, Query } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Request, Response } from 'express';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('login')
  loginForm(@Req() req: Request, @Query('error') error?: string, @Query('registrado') registrado?: string) {
    const session = req.session as any;
    if (session && session.user) {
      return { redirect: '/contactos' };
    }

    let mensajeError = null;
    let mensajeExito = null;

    if (error) {
      mensajeError = 'Usuario o contraseña incorrectos.';
    }
    if (registrado) {
      mensajeExito = '¡Cuenta creada correctamente! Ya puedes iniciar sesión.';
    }

    return { error: mensajeError, exito: mensajeExito };
  }

  @Post('login')
  async login(@Body() body: any, @Req() req: Request, @Res() res: Response) {
    const { username, password } = body;

    if (!username || !password) {
      return res.render('login', {
        error: 'Por favor, introduce usuario y contraseña.',
        exito: null,
      });
    }

    const usuario = await this.authService.validar(username, password);
    if (!usuario) {
      return res.render('login', {
        error: 'Usuario o contraseña incorrectos.',
        exito: null,
      });
    }

    const session = req.session as any;
    session.user = usuario;

    return res.redirect('/contactos');
  }

  @Get('registro')
  @Render('registro')
  registroForm(@Req() req: Request) {
    const session = req.session as any;
    if (session && session.user) {
      return { redirect: '/contactos' };
    }
    return { error: null };
  }

  @Post('registro')
  async registro(@Body() body: any, @Res() res: Response) {
    const { username, nombre, password } = body;

    if (!username || !nombre || !password) {
      return res.render('registro', {
        error: 'Todos los campos son obligatorios.',
      });
    }

    if (password.length < 4) {
      return res.render('registro', {
        error: 'La contraseña debe tener al menos 4 caracteres.',
      });
    }

    try {
      await this.authService.registrar(username, nombre, password);
      return res.redirect('/login?registrado=true');
    } catch (err: any) {
      return res.render('registro', {
        error: err.message || 'Error al registrar el usuario.',
      });
    }
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}
