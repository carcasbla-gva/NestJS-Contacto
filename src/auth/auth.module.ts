import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
