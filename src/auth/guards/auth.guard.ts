import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';


@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const session = req.session as any;
    if (session && session.user) {
      return true;
    }

    res.redirect('/login');
    return false;
  }
}
