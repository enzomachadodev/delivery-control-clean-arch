import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import { applyGlobalConfig } from '@/global-config';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infra/env-config/env-config.module';
import { DatabaseModule } from '@/shared/infra/database/database.module';

import { BcryptHashProvider } from '@/users/infra/providers/hash-provider/bcrypt-hash.provider';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { UsersModule } from '@/users/infra/users.module';
import { OrdersModule } from '../../orders.module';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('OrdersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let orderRepository: OrderRepository.Repository;
  let userRepository: UserRepository;
  const prismaService = new PrismaClient();
  let userEntity: UserEntity;
  let orderEntity: OrderEntity;
  let hashProvider: HashProvider;
  let hashPassword: string;
  let accessToken: string;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        OrdersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    userRepository = module.get<UserRepository>('UserRepository');
    orderRepository = module.get<OrderRepository.Repository>('OrderRepository');
    hashProvider = new BcryptHashProvider();
    hashPassword = await hashProvider.generateHash('1234');
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.order.deleteMany();
    await prismaService.statusHistory.deleteMany();
    userEntity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    );
    await userRepository.insert(userEntity);
    orderEntity = new OrderEntity(OrderDataBuilder({ userId: userEntity._id }));

    await orderRepository.insert(orderEntity);

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200);
    accessToken = loginResponse.body.accessToken;
  });

  describe('DELETE /orders/:id', () => {
    it('should remove a order', async () => {
      await request(app.getHttpServer())
        .delete(`/orders/${orderEntity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204)
        .expect({});
    });

    it('should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      await request(app.getHttpServer())
        .delete('/orders/fakeId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'OrderModel not found using ID: fakeId',
        });
    });

    it('should return a error with 401 code when the request is not authorized', async () => {
      await request(app.getHttpServer())
        .delete('/orders/fakeId')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
  });
});
