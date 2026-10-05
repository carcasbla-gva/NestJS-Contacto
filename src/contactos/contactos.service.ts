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
}