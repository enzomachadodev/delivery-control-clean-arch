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

import { CreateOrderDto } from '../../dtos';
import { BcryptHashProvider } from '@/users/infra/providers/hash-provider/bcrypt-hash.provider';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { UsersModule } from '@/users/infra/users.module';
import { OrdersController } from '../../orders.controller';
import { OrdersModule } from '../../orders.module';

describe('OrdersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let orderRepository: OrderRepository.Repository;
  let userRepository: UserRepository;
  const prismaService = new PrismaClient();
  let entity: UserEntity;
  let hashProvider: HashProvider;
  let hashPassword: string;
  let accessToken: string;
  let createOrderDto: CreateOrderDto;

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
    createOrderDto = {
      customerName: 'John Doe',
      street: 'Street test',
      number: 1234,
      complement: 'Complement test',
      neighborhood: 'Neighborhood test',
      city: 'City test',
      state: 'ST',
      zipCode: '36570260',
    };
    await prismaService.user.deleteMany();
    await prismaService.order.deleteMany();
    await prismaService.statusHistory.deleteMany();
    entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    );
    await userRepository.insert(entity);

    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200);
    accessToken = loginResponse.body.accessToken;
  });

  describe('POST /orders', () => {
    it('should create a order', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createOrderDto)
        .expect(201);
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const order = await orderRepository.findById(res.body.data.id);
      const presenter = OrdersController.orderToResponse(order.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'customerName should not be empty',
        'customerName must be a string',
        'street should not be empty',
        'street must be a string',
        'number should not be empty',
        'number must be a number conforming to the specified constraints',
        'neighborhood should not be empty',
        'neighborhood must be a string',
        'city should not be empty',
        'city must be a string',
        'state must be uppercase',
        'state must be longer than or equal to 2 characters',
        'state should not be empty',
        'state must be a string',
        'zipCode must be a number string',
        'zipCode must be longer than or equal to 8 characters',
        'zipCode should not be empty',
        'zipCode must be a string',
      ]);
    });

    it('should return a error with 422 code when the customerName field is invalid', async () => {
      delete createOrderDto.customerName;
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createOrderDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'customerName should not be empty',
        'customerName must be a string',
      ]);
    });

    it('should return a error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/orders')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(Object.assign(createOrderDto, { xpto: 'fake' }))
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property xpto should not exist']);
    });
  });
});
