import { PrismaClient } from '@prisma/client';
import { CreateOrderUseCase } from '../../create-order.usecase';
import { OrderPrismaRepository } from '@/orders/infra/database/prisma/repositories/order-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infra/database/database.module';
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository';
import { StatusHistoryPrismaRepository } from '@/status-history/infra/database/prisma/repositories/status-history-prisma.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('CreateOrderUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: CreateOrderUseCase.UseCase;
  let orderRepository: OrderPrismaRepository;
  let userRepository: UserPrismaRepository;
  let statusHistoryRepository: StatusHistoryPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    orderRepository = new OrderPrismaRepository(prismaService as any);
    userRepository = new UserPrismaRepository(prismaService as any);
    statusHistoryRepository = new StatusHistoryPrismaRepository(
      prismaService as any,
    );
  });

  beforeEach(async () => {
    sut = new CreateOrderUseCase.UseCase(
      orderRepository,
      userRepository,
      statusHistoryRepository,
    );
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a order', async () => {
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    const props = {
      userId: userEntity._id,
      customerName: 'customer test',
      street: 'street test',
      number: 123,
      neighborhood: 'neighborhood test',
      city: 'test city',
      state: 'DF',
      zipCode: '36570-000',
    };
    const output = await sut.execute(props);
    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
