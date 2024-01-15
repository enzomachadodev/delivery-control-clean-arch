import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { DeleteOrderUseCase } from '../../delete-order.usecase';
import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('DeleteOrderUseCase unit tests', () => {
  let sut: DeleteOrderUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;
  const userId = 'c130559c-1e83-4217-84a9-4c25f74235d7';

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    sut = new DeleteOrderUseCase.UseCase(orderRepository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ orderId: 'fakeId', userId }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should delete a order', async () => {
    const spyDelete = jest.spyOn(orderRepository, 'delete');
    const orderEntity = new OrderEntity(OrderDataBuilder({ userId }));
    const orderItems = [orderEntity];
    orderRepository.items = orderItems;
    expect(orderRepository.items).toHaveLength(1);
    await sut.execute({ orderId: orderItems[0]._id, userId });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(orderRepository.items).toHaveLength(0);
  });
});
