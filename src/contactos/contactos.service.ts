import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacto } from './entities/contacto.entity.js';

@Injectable()
export class ContactosService {
  constructor(
    @InjectRepository(Contacto)
    private contactoRepository: Repository<Contacto>,
  ) {}

  findAll() {
    return this.contactoRepository.find();
  }

  create(contactoData: Partial<Contacto>) {
    return this.contactoRepository.save(contactoData);
  }

  // NUEVO: Buscar un contacto concreto por su ID
  findOne(id: number) {
    return this.contactoRepository.findOneBy({ id });
  }

  // NUEVO: Actualizar un contacto
  async update(id: number, contactoData: Partial<Contacto>) {
    await this.contactoRepository.update(id, contactoData);
  }

  // NUEVO: Eliminar un contacto
  async remove(id: number) {
    await this.contactoRepository.delete(id);
  }
}