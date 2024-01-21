import { DatabaseModule } from '@/shared/infra/database/database.module';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ListUserOrdersUseCase } from '../../list-user-orders.usecase';
import { OrderPrismaRepository } from '@/orders/infra/database/prisma/repositories/order-prisma.repository';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

describe('ListUserOrdersUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUserOrdersUseCase.UseCase;
  let repository: OrderPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new OrderPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListUserOrdersUseCase.UseCase(repository);
    await prismaService.order.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should returns all orders of a user', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const date = new Date();
    const entities: OrderEntity[] = [];
    const arrange = Array(3).fill(OrderDataBuilder({ userId: userEntity._id }));
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
      data: entities.map((item) => item.toJSON()),
    });

    const output = await sut.execute({ userId: userEntity._id });

    expect(output).toStrictEqual({
      items: entities.reverse().map((item) => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });
});
