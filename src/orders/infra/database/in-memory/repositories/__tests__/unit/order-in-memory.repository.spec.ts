import { OrderInMemoryRepository } from '../../order-in-memory.repository';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('OrderInMemoryRepository unit tests', () => {
  let sut: OrderInMemoryRepository;

  beforeEach(() => {
    sut = new OrderInMemoryRepository();
  });

  it('Should list orders by userId - findByUserId method', async () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByUserId(entity.userId);
    expect([entity]).toStrictEqual(result);
  });
});
