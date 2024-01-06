import { BadRequestError } from '@/shared/app/errors/bad-request-error';
import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/user-in-memory.repository';
import { CreateOrderUseCase } from '../../create-order.usecase';
import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { StatusHistoryInMemoryRepository } from '@/status-history/infra/database/in-memory/repositories/status-history-in-memory.repository';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';

describe('CreateOrderUseCase unit tests', () => {
  let sut: CreateOrderUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;
  let userRepository: UserInMemoryRepository;
  let statusHistoryRepository: StatusHistoryInMemoryRepository;

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    userRepository = new UserInMemoryRepository();
    statusHistoryRepository = new StatusHistoryInMemoryRepository();
    sut = new CreateOrderUseCase.UseCase(
      orderRepository,
      userRepository,
      statusHistoryRepository,
    );
  });

  it('Should create a order', async () => {
    const spyInsert = jest.spyOn(orderRepository, 'insert');
    const userProps = UserDataBuilder({});
    const userEntity = new UserEntity(userProps);
    await userRepository.insert(userEntity);
    const orderProps = OrderDataBuilder({ userId: userEntity.id });
    const result = await sut.execute(orderProps);
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.userId).toEqual(userEntity.id);
    expect(result.currentStatus).toEqual(OrderStatus.CONFIRMED);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });

  it('Should not be able to create a order with invalid userId', async () => {
    const props = Object.assign(OrderDataBuilder({}), { userId: 'fakeId' });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it('Should throws error when userId not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { userId: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when street not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { street: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when number not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { number: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when neighborhood not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { neighborhood: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when city not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { city: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when state not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { state: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it('Should throws error when zipCode not provided', async () => {
    const props = Object.assign(OrderDataBuilder({}), { zipCode: null });
    await expect(() => sut.execute(props)).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });
});
