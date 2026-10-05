import { Test, TestingModule } from '@nestjs/testing';
import { ContactosController } from './contactos.controller.js';
import { ContactosService } from './contactos.service.js';

describe('ContactosController', () => {
  let controller: ContactosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactosController],
      providers: [ContactosService],
    }).compile();

    controller = module.get<ContactosController>(ContactosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
