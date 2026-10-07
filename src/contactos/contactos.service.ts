import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, type FindOptionsWhere } from 'typeorm';
import { Contacto } from './entities/contacto.entity.js';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  search?: string;
}

@Injectable()
export class ContactosService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
  ) {}

  findAll() {
    return this.contactoRepository.find({ order: { id: 'ASC' } });
  }

  async findPaginated(options: PaginationOptions) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(options.limit) || 10));
    const search = options.search?.trim() || '';
    const order: 'ASC' | 'DESC' = options.order === 'DESC' ? 'DESC' : 'ASC';

    const validSortFields = ['id', 'nombre', 'apellidos', 'telefono', 'email', 'provincia', 'pais'];
    const sortBy = validSortFields.includes(options.sortBy || '') ? options.sortBy! : 'id';

    let where: FindOptionsWhere<Contacto> | FindOptionsWhere<Contacto>[] = {};

    if (search) {
      const term = `%${search}%`;
      where = [
        { nombre: ILike(term) },
        { apellidos: ILike(term) },
        { telefono: ILike(term) },
        { email: ILike(term) },
        { provincia: ILike(term) },
        { pais: ILike(term) },
      ];
    }

    const [contactos, total] = await this.contactoRepository.findAndCount({
      where,
      order: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      contactos,
      total,
      totalPages,
      currentPage: page,
      limit,
      sortBy,
      order,
      search,
    };
  }

  create(contactoData: Partial<Contacto>) {
    return this.contactoRepository.save(contactoData);
  }

  createMany(contactosData: Partial<Contacto>[]) {
    return this.contactoRepository.save(contactosData);
  }

  findOne(id: number) {
    return this.contactoRepository.findOneBy({ id });
  }

  async update(id: number, contactoData: Partial<Contacto>) {
    await this.contactoRepository.update(id, contactoData);
  }

  async remove(id: number) {
    await this.contactoRepository.delete(id);
  }

  // Generar contenido CSV con BOM UTF-8
  async exportarCSV(): Promise<string> {
    const contactos = await this.contactoRepository.find({ order: { id: 'ASC' } });
    const BOM = '\uFEFF';
    const header = 'ID,Nombre,Apellidos,Teléfono,Email,Provincia,País\n';
    
    const rows = contactos.map(c => {
      const escape = (val?: string | number | null) => {
        if (val === null || val === undefined) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      return [
        c.id,
        escape(c.nombre),
        escape(c.apellidos),
        escape(c.telefono),
        escape(c.email),
        escape(c.provincia),
        escape(c.pais),
      ].join(',');
    }).join('\n');

    return BOM + header + rows;
  }

  // Importar contactos desde contenido CSV
  async importarCSV(contenidoCSV: string): Promise<number> {
    // Limpiar BOM si existe
    const limpio = contenidoCSV.replace(/^\uFEFF/, '');
    const lineas = limpio.split(/\r?\n/).filter(linea => linea.trim() !== '');

    if (lineas.length === 0) {
      return 0;
    }

    const nuevosContactos: Partial<Contacto>[] = [];

    // Comprobar si la primera línea es cabecera
    let inicio = 0;
    const primeraLinea = lineas[0].toLowerCase();
    if (primeraLinea.includes('nombre') || primeraLinea.includes('email') || primeraLinea.includes('telefono')) {
      inicio = 1;
    }

    for (let i = inicio; i < lineas.length; i++) {
      const linea = lineas[i].trim();
      if (!linea) continue;

      // Parsear respetando comillas
      const valores = this.parseCSVLine(linea);
      if (valores.length >= 4) {
        // Formato con ID (7 columnas: ID, Nombre, Apellidos, Teléfono, Email, Provincia, País)
        // o sin ID (4 a 6 columnas: Nombre, Apellidos, Teléfono, Email, Provincia, País)
        let nombre = '';
        let apellidos = '';
        let telefono = '';
        let email = '';
        let provincia = '';
        let pais = '';

        if (valores.length >= 7 && !isNaN(Number(valores[0])) && valores[0] !== '') {
          nombre = valores[1] || '';
          apellidos = valores[2] || '';
          telefono = valores[3] || '';
          email = valores[4] || '';
          provincia = valores[5] || '';
          pais = valores[6] || '';
        } else {
          nombre = valores[0] || '';
          apellidos = valores[1] || '';
          telefono = valores[2] || '';
          email = valores[3] || '';
          provincia = valores[4] || '';
          pais = valores[5] || '';
        }

        if (nombre && telefono) {
          nuevosContactos.push({
            nombre: nombre.trim(),
            apellidos: apellidos.trim(),
            telefono: telefono.trim(),
            email: email.trim(),
            provincia: provincia.trim(),
            pais: pais.trim(),
          });
        }
      }
    }

    if (nuevosContactos.length > 0) {
      await this.contactoRepository.save(nuevosContactos);
    }

    return nuevosContactos.length;
  }

  // Parser simple para líneas CSV con comillas
  private parseCSVLine(linea: string): string[] {
    const resultado: string[] = [];
    let enComillas = false;
    let valorActual = '';

    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];

      if (c === '"') {
        if (enComillas && linea[i + 1] === '"') {
          valorActual += '"';
          i++; // saltar comilla escapada
        } else {
          enComillas = !enComillas;
        }
      } else if (c === ',' && !enComillas) {
        resultado.push(valorActual.trim());
        valorActual = '';
      } else {
        valorActual += c;
      }
    }

    resultado.push(valorActual.trim());
    return resultado;
  }
}