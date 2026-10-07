import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity.js';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async buscarPorUsername(username: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ username });
  }

  async registrar(username: string, nombre: string, passwordPlana: string): Promise<Usuario> {
    const existe = await this.buscarPorUsername(username);
    if (existe) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(passwordPlana, saltRounds);

    const nuevoUsuario = this.usuarioRepository.create({
      username,
      nombre,
      password: passwordHash,
    });

    return this.usuarioRepository.save(nuevoUsuario);
  }

  async validar(username: string, passwordPlana: string): Promise<Omit<Usuario, 'password'> | null> {
    const usuario = await this.buscarPorUsername(username);
    if (!usuario) {
      return null;
    }

    const coincide = await bcrypt.compare(passwordPlana, usuario.password);
    if (!coincide) {
      return null;
    }

    const { password: _password, ...resultado } = usuario;
    return resultado;
  }
}

