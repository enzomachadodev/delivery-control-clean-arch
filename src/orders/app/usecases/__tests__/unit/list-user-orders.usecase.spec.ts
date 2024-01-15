import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { ListUserOrdersUseCase } from '../../list-user-orders.usecase';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { randomUUID } from 'crypto';

describe('ListUserOrdersUseCase unit tests', () => {
  let sut: ListUserOrdersUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    sut = new ListUserOrdersUseCase.UseCase(orderRepository);
  });

  it('toOutput method', () => {
    let result = new OrderRepository.SearchResult({
      items: [],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });
    let output = sut['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });

    const entity = new OrderEntity(OrderDataBuilder({}));
    result = new OrderRepository.SearchResult({
      items: [entity],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDir: null,
      filter: null,
    });
    output = sut['toOutput'](result);
    expect(output).toStrictEqual({
      items: [entity.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    });
  });

  it('should return the orders of a user ordered by createdAt', async () => {
    const createdAt = new Date();
    const userId = randomUUID();

    const items = [
      new OrderEntity(OrderDataBuilder({ userId, createdAt })),
      new OrderEntity(
        OrderDataBuilder({
          userId,
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
    ];
    orderRepository.items = items;
    const output = await sut.execute({ userId });
    expect(output).toStrictEqual({
      items: [...items].reverse().map((item) => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    });
  });

  it('should return the orders of a user using pagination, sort and filter', async () => {
    const userId = randomUUID();
    const items = [
      new OrderEntity(OrderDataBuilder({ userId, customerName: 'a' })),
      new OrderEntity(OrderDataBuilder({ userId, customerName: 'AA' })),
      new OrderEntity(OrderDataBuilder({ userId, customerName: 'Aa' })),
      new OrderEntity(OrderDataBuilder({ userId, customerName: 'b' })),
      new OrderEntity(OrderDataBuilder({ userId, customerName: 'c' })),
    ];
    orderRepository.items = items;
    let output = await sut.execute({
      userId,
      page: 1,
      perPage: 2,
      sort: 'customerName',
      sortDir: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      userId,
      page: 2,
      perPage: 2,
      sort: 'customerName',
      sortDir: 'asc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    });

    output = await sut.execute({
      userId,
      page: 1,
      perPage: 3,
      sort: 'customerName',
      sortDir: 'desc',
      filter: 'a',
    });
    expect(output).toStrictEqual({
      items: [items[0].toJSON(), items[2].toJSON(), items[1].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    });
  });
});
