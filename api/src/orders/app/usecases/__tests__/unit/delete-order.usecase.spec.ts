import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DeleteOrderUseCase } from '../../delete-order.usecase';
import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { StatusHistoryInMemoryRepository } from '@/status-history/infra/database/in-memory/repositories/status-history-in-memory.repository';
import { StatusHistoryEntity } from '@/status-history/domain/entities/status-history.entity';
import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('DeleteOrderUseCase unit tests', () => {
  let sut: DeleteOrderUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;
  let statusHistoryRepository: StatusHistoryInMemoryRepository;

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    statusHistoryRepository = new StatusHistoryInMemoryRepository();
    sut = new DeleteOrderUseCase.UseCase(
      orderRepository,
      statusHistoryRepository,
    );
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('Should delete a order', async () => {
    const spyDelete = jest.spyOn(orderRepository, 'delete');
    const spyDeleteMany = jest.spyOn(
      statusHistoryRepository,
      'deleteManyByOrderId',
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
    await sut.execute({ id: orderItems[0]._id });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(spyDeleteMany).toHaveBeenCalledTimes(1);
    expect(orderRepository.items).toHaveLength(0);
    expect(statusHistoryRepository.items).toHaveLength(0);
  });
});
