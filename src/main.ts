import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuración de sesiones HTTP
  app.use(
    session({
      secret: 'nest_contacto_secreto_super_seguro_2026',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 1 día de sesión
      },
    }),
  );

  // Configuración para leer HTML (EJS) y CSS estático
  app.useStaticAssets(join(process.cwd(), 'public'));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  await app.listen(3000);
}
void bootstrap();


