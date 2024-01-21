import { Order, PrismaClient } from '@prisma/client';
import { OrderModelMapper } from '../../order-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

describe('OrderModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.order.deleteMany();
    const id = 'df96ae94-6128-486e-840c-b6f78abb4801';
    const userEntity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: userEntity.toJSON(),
    });
    props = {
      id,
      userId: userEntity._id,
      customerName: 'John Doe',
      currentStatus: OrderStatus.CONFIRMED,
      street: 'Street test',
      number: 1234,
      complement: 'Complement test',
      neighborhood: 'Neighborhood test',
      city: 'City test',
      state: 'ST',
      zipCode: '36570260',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws error when user model is invalid', async () => {
    const model: Order = Object.assign(props, { customerName: null });
    expect(() => OrderModelMapper.toEntity(model)).toThrow(ValidationError);
  });

  it('should convert a user model to a order entity', async () => {
    const model: Order = await prismaService.order.create({
      data: props,
    });
    const sut = OrderModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(OrderEntity);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
