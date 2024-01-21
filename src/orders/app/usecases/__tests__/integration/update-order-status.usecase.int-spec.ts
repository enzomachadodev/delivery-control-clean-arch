import { DatabaseModule } from '@/shared/infra/database/database.module';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UpdateOrderStatusUseCase } from '../../update-order-status.usecase';
import { OrderPrismaRepository } from '@/orders/infra/database/prisma/repositories/order-prisma.repository';
import { StatusHistoryPrismaRepository } from '@/status-history/infra/database/prisma/repositories/status-history-prisma.repository';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderEntity } from '@/orders/domain/entities/order.entity';

describe('UpdateOrderStatusUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdateOrderStatusUseCase.UseCase;
  let orderRepository: OrderPrismaRepository;
  let statusHistoryRepository: StatusHistoryPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    orderRepository = new OrderPrismaRepository(prismaService as any);
    statusHistoryRepository = new StatusHistoryPrismaRepository(
      prismaService as any,
    );
  });

  beforeEach(async () => {
    sut = new UpdateOrderStatusUseCase.UseCase(
      orderRepository,
      statusHistoryRepository,
    );
    await prismaService.order.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        orderId: 'fakeId',
        userId: 'fakeUserId',
        status: OrderStatus.CANCELED,
      }),
    ).rejects.toThrow(
      new NotFoundError('OrderModel not found using ID: fakeId'),
    );
  });

  it('should update a order status', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });

    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    await prismaService.order.create({
      data: orderEntity.toJSON(),
    });

    const output = await sut.execute({
      orderId: orderEntity._id,
      status: OrderStatus.DELIVERED,
      userId: userEntity._id,
    });

    expect(output.currentStatus).toBe(OrderStatus.DELIVERED);
  });
});
