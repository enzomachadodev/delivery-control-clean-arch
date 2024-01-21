import { DatabaseModule } from '@/shared/infra/database/database.module';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { DeleteOrderUseCase } from '../../delete-order.usecase';
import { OrderPrismaRepository } from '@/orders/infra/database/prisma/repositories/order-prisma.repository';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

describe('DeleteOrderUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteOrderUseCase.UseCase;
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
    sut = new DeleteOrderUseCase.UseCase(repository);
    await prismaService.order.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ orderId: 'fakeId', userId: 'fakeUserId' }),
    ).rejects.toThrow(
      new NotFoundError('OrderModel not found using ID: fakeId'),
    );
  });

  it('should delete a order', async () => {
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

    await sut.execute({ orderId: orderEntity._id, userId: userEntity._id });

    const output = await prismaService.order.findUnique({
      where: {
        id: orderEntity._id,
      },
    });
    expect(output).toBeNull();
    const models = await prismaService.order.findMany();
    expect(models).toHaveLength(0);
  });
});
