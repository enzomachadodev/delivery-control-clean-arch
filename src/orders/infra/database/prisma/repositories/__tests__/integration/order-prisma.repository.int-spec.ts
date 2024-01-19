import { OrderStatus as PrismaOrderStatus, PrismaClient } from '@prisma/client';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { OrderPrismaRepository } from '../../order-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infra/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';

describe('OrderPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: OrderPrismaRepository;
  //eslint-disable-next-line
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new OrderPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('OrderModel not found using ID: FakeId'),
    );
  });

  it('should finds a entity by id', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: userEntity.toJSON(),
    });

    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: newUser.id }),
    );

    const newOrder = await prismaService.order.create({
      data: {
        ...orderEntity.toJSON(),
        currentStatus: OrderStatus[
          orderEntity.currentStatus
        ] as PrismaOrderStatus,
      },
    });

    const output = await sut.findById(newOrder.id);
    expect(output.toJSON()).toStrictEqual(orderEntity.toJSON());
  });

  it('should insert a new entity', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    await sut.insert(orderEntity);

    const result = await prismaService.order.findUnique({
      where: {
        id: orderEntity._id,
      },
    });

    expect(result).toStrictEqual({
      ...orderEntity.toJSON(),
      currentStatus: 'CONFIRMED',
    });
  });

  it('should returns all orders', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    await prismaService.order.create({
      data: {
        ...orderEntity.toJSON(),
        currentStatus: OrderStatus[
          orderEntity.currentStatus
        ] as PrismaOrderStatus,
      },
    });

    const entities = await sut.findAll();
    expect(entities).toHaveLength(1);
    expect(entities).toEqual([
      expect.objectContaining({
        ...orderEntity.toJSON(),
      }),
    ]);
  });

  it('should throws error on update when a entity not found', async () => {
    const orderEntity = new OrderEntity(OrderDataBuilder({}));
    await expect(() => sut.update(orderEntity)).rejects.toThrow(
      new NotFoundError(`OrderModel not found using ID: ${orderEntity._id}`),
    );
  });

  it('should update a entity', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    await prismaService.order.create({
      data: {
        ...orderEntity.toJSON(),
        currentStatus: OrderStatus[
          orderEntity.currentStatus
        ] as PrismaOrderStatus,
      },
    });
    orderEntity.updateStatus(OrderStatus.DISPATCHED);
    await sut.update(orderEntity);

    const output = await prismaService.order.findUnique({
      where: {
        id: orderEntity._id,
      },
    });
    expect(output.currentStatus).toBe('DISPATCHED');
  });

  it('should throws error on delete when a entity not found', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const entity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`OrderModel not found using ID: ${entity._id}`),
    );
  });

  it('should delete a entity', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    await prismaService.order.create({
      data: {
        ...orderEntity.toJSON(),
        currentStatus: OrderStatus[
          orderEntity.currentStatus
        ] as PrismaOrderStatus,
      },
    });
    await sut.delete(orderEntity._id);

    const output = await prismaService.order.findUnique({
      where: {
        id: orderEntity._id,
      },
    });
    expect(output).toBeNull();
  });

  describe('search method tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: userEntity.toJSON(),
      });
      const date = new Date();
      const entities: OrderEntity[] = [];
      const arrange = Array(16).fill(
        OrderDataBuilder({ userId: userEntity._id }),
      );
      arrange.forEach((element, index) => {
        entities.push(
          new OrderEntity({
            ...element,
            customerName: `test${index}`,
            createdAt: new Date(date.getTime() + index),
            updatedAt: new Date(date.getTime() + index),
          }),
        );
      });

      await prismaService.order.createMany({
        data: entities.map((item) => ({
          ...item.toJSON(),
          currentStatus: OrderStatus[item.currentStatus] as PrismaOrderStatus,
        })),
      });

      const searchOutput = await sut.search(new OrderRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(OrderRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(OrderEntity);
      });
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}`).toBe(item.customerName);
      });
    });

    it('should search using filter, sort and paginate', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: userEntity.toJSON(),
      });
      const date = new Date();
      const entities: OrderEntity[] = [];
      const arrange = ['atest', 'a', 'bTEST', 'b', 'cTeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new OrderEntity({
            ...OrderDataBuilder({
              userId: userEntity._id,
              customerName: element,
              createdAt: new Date(date.getTime() + index),
              updatedAt: new Date(date.getTime() + index),
            }),
          }),
        );
      });

      await prismaService.order.createMany({
        data: entities.map((item) => ({
          ...item.toJSON(),
          currentStatus: OrderStatus[item.currentStatus] as PrismaOrderStatus,
        })),
      });

      const searchOutputPage1 = await sut.search(
        new OrderRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'customerName',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new OrderRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'customerName',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );
    });

    it('should search using filter, sort and paginate by userId', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({
        data: userEntity.toJSON(),
      });

      const date = new Date();
      const entities: OrderEntity[] = [];
      const arrange = ['atest', 'a', 'bTEST', 'b', 'cTeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new OrderEntity({
            ...OrderDataBuilder({
              userId: userEntity._id,
              customerName: element,
              createdAt: new Date(date.getTime() + index),
              updatedAt: new Date(date.getTime() + index),
            }),
          }),
        );
      });

      await prismaService.order.createMany({
        data: entities.map((item) => ({
          ...item.toJSON(),
          currentStatus: OrderStatus[item.currentStatus] as PrismaOrderStatus,
        })),
      });

      const searchOutputPage1 = await sut.findByUserId(
        userEntity._id,
        new OrderRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'customerName',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );

      const searchOutputPage2 = await sut.findByUserId(
        userEntity._id,
        new OrderRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'customerName',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );
    });
  });
});
