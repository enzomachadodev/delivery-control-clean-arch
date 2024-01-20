import { Reflector } from '@nestjs/core';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infra/interceptors/wrapper-data/wrapper-data.interceptor';
import { ConflictErrorFilter } from './shared/infra/exception-filter/conflict-error/conflict-error.filter';
import { NotFoundErrorFilter } from './shared/infra/exception-filter/not-found-error/not-found-error.filter';
import { InvalidPasswordErrorFilter } from './shared/infra/exception-filter/invalid-password-error/invalid-password-error.filter';
import { InvalidCredentialsErrorFilter } from './shared/infra/exception-filter/invalid-credentials-error/invalid-credentials-error.filter';

export const applyGlobalConfig = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidPasswordErrorFilter(),
    new InvalidCredentialsErrorFilter(),
  );
};
