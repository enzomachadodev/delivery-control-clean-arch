import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { instanceToPlain } from 'class-transformer';
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
import { OrdersController } from '../../orders.controller';
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

  describe('GET /orders', () => {
    it('should return the orders of a user ordered by createdAt', async () => {
      const date = new Date();
      const entities: OrderEntity[] = [];
      const arrange = Array(3).fill(
        OrderDataBuilder({ userId: userEntity._id }),
      );
      arrange.forEach((element, index) => {
        entities.push(
          new OrderEntity({
            ...element,
            customerName: `a${index}`,
            createdAt: new Date(date.getTime() + index),
            updatedAt: new Date(date.getTime() + index),
          }),
        );
      });
      await prismaService.order.deleteMany();
      await prismaService.order.createMany({
        data: entities.map((item) => item.toJSON()),
      });
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/orders/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map((item) =>
            instanceToPlain(OrdersController.orderToResponse(item)),
          ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 15,
          lastPage: 1,
        },
      });
    });

    it('should return the orders of a user ordered by createdAt', async () => {
      const date = new Date();
      const entities: OrderEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new OrderEntity({
            ...OrderDataBuilder({ userId: userEntity._id }),
            customerName: element,
            street: `a${index}`,
            createdAt: new Date(date.getTime() + index),
            updatedAt: new Date(date.getTime() + index),
          }),
        );
      });
      await prismaService.order.createMany({
        data: entities.map((item) => item.toJSON()),
      });
      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'customerName',
        sortDir: 'asc',
        filter: 'TEST',
      };
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/orders/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[0], entities[4]].map((item) =>
          instanceToPlain(OrdersController.orderToResponse(item)),
        ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
        },
      });
    });

    it('should return a error with 422 code when the query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get('/orders/?fakeId=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property fakeId should not exist']);
    });

    it('should return a error with 401 code when the request is not authorized', async () => {
      await request(app.getHttpServer()).get('/orders').expect(401).expect({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });
  });
});
