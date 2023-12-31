import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { ListUserOrdersUseCase } from '../../list-user-orders.usecase';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('ListUserOrdersUseCase unit tests', () => {
  let sut: ListUserOrdersUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    sut = new ListUserOrdersUseCase.UseCase(orderRepository);
  });

  it('should return the orders of a user', async () => {
    const order1 = new OrderEntity(OrderDataBuilder({}));
    const order2 = new OrderEntity(OrderDataBuilder({ userId: order1.userId }));

    const items = [order1, order2];
    orderRepository.items = items;
    const output = await sut.execute({ userId: order1.userId });
    expect(output).toHaveLength(2);
    expect(output[0]).toStrictEqual(order1);
    expect(output[1]).toStrictEqual(order2);
  });
});
