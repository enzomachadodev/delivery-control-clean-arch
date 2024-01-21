import { PrismaClient } from '@prisma/client';
import { GetOrderUseCase } from '../../get-order.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infra/database/database.module';
import { OrderPrismaRepository } from '@/orders/infra/database/prisma/repositories/order-prisma.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('GetOrderUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: GetOrderUseCase.UseCase;
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
    sut = new GetOrderUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', userId: 'fakeUserId' }),
    ).rejects.toThrow(
      new NotFoundError('OrderModel not found using ID: fakeId'),
    );
  });

  it('should returns a order', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });

    const orderEntity = new OrderEntity(
      OrderDataBuilder({ userId: userEntity._id }),
    );
    const model = await prismaService.order.create({
      data: orderEntity.toJSON(),
    });

    const output = await sut.execute({
      id: orderEntity._id,
      userId: userEntity._id,
    });

    expect(output).toMatchObject(model);
  });
});
