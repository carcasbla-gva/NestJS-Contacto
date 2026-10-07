import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';


@Controller()
export class AppController {
  @Get()
  index(@Req() req: Request, @Res() res: Response) {
    const session = req.session as any;
    if (session && session.user) {
      return res.redirect('/contactos');
    }
    return res.redirect('/login');
  }
}

