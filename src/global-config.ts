import { Reflector } from '@nestjs/core';

import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infra/interceptors/wrapper-data/wrapper-data.interceptor';

export async function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
