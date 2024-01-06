import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { GetOrderUseCase } from '../../get-order.usecase';
import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { StatusHistoryInMemoryRepository } from '@/status-history/infra/database/in-memory/repositories/status-history-in-memory.repository';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { UnauthorizedError } from '@/shared/app/errors/unauthorized-error';
import { StatusHistoryEntity } from '@/status-history/domain/entities/status-history.entity';
import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';

describe('GetOrderUseCase unit tests', () => {
  let sut: GetOrderUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;
  let statusHistoryRepository: StatusHistoryInMemoryRepository;

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    statusHistoryRepository = new StatusHistoryInMemoryRepository();
    sut = new GetOrderUseCase.UseCase(orderRepository, statusHistoryRepository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fakeId', userId: 'user_id' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throws error when entity belongs to another user', async () => {
    orderRepository.items = [new OrderEntity(OrderDataBuilder({}))];
    await expect(() =>
      sut.execute({ id: orderRepository.items[0]._id, userId: 'fake_id' }),
    ).rejects.toThrow(new UnauthorizedError('Insufficient permission'));
  });

  it('Should be able to get order', async () => {
    const spyFindById = jest.spyOn(orderRepository, 'findById');
    const spyFindByOrderId = jest.spyOn(
      statusHistoryRepository,
      'findByOrderId',
    );
    const orderEntity = new OrderEntity(OrderDataBuilder({}));
    const orderItems = [orderEntity];
    orderRepository.items = orderItems;
    const statusHistoryItems = [
      new StatusHistoryEntity(
        StatusHistoryDataBuilder({ orderId: orderEntity._id }),
      ),
    ];
    statusHistoryRepository.items = statusHistoryItems;
    expect(orderRepository.items).toHaveLength(1);
    expect(statusHistoryRepository.items).toHaveLength(1);
    const result = await sut.execute({
      id: orderItems[0]._id,
      userId: orderItems[0].userId,
    });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(spyFindByOrderId).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: orderItems[0]._id,
      userId: orderItems[0].userId,
      customerName: orderItems[0].customerName,
      street: orderItems[0].street,
      number: orderItems[0].number,
      complement: orderItems[0].complement,
      neighborhood: orderItems[0].neighborhood,
      city: orderItems[0].city,
      state: orderItems[0].state,
      zipCode: orderItems[0].zipCode,
      currentStatus: orderItems[0].currentStatus,
      createdAt: orderItems[0].createdAt,
      updatedAt: orderItems[0].updatedAt,
      statusHistory: [
        {
          id: statusHistoryItems[0].id,
          orderId: statusHistoryItems[0].orderId,
          status: statusHistoryItems[0].status,
          createdAt: statusHistoryItems[0].createdAt,
        },
      ],
    });
  });
});
