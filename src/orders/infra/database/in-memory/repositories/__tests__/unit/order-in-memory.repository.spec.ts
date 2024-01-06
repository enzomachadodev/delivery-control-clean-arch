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

  it('Should no filter items when filter object is null', async () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findAll();
    const spyFilter = jest.spyOn(result, 'filter');
    const itemsFiltered = await sut['applyFilter'](result, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(result);
  });

  it('Should filter customerName field using filter param', async () => {
    const items = [
      new OrderEntity(OrderDataBuilder({ customerName: 'Test' })),
      new OrderEntity(OrderDataBuilder({ customerName: 'TEST' })),
      new OrderEntity(OrderDataBuilder({ customerName: 'fake' })),
    ];
    const spyFilter = jest.spyOn(items, 'filter');
    const itemsFiltered = await sut['applyFilter'](items, 'TEST');
    expect(spyFilter).toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date();
    const items = [
      new OrderEntity(OrderDataBuilder({ customerName: 'Test', createdAt })),
      new OrderEntity(
        OrderDataBuilder({
          customerName: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new OrderEntity(
        OrderDataBuilder({
          customerName: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];
    const itemsSorted = await sut['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('Should sort by customerName field', async () => {
    const items = [
      new OrderEntity(OrderDataBuilder({ customerName: 'c' })),
      new OrderEntity(
        OrderDataBuilder({
          customerName: 'd',
        }),
      ),
      new OrderEntity(
        OrderDataBuilder({
          customerName: 'a',
        }),
      ),
    ];
    let itemsSorted = await sut['applySort'](items, 'customerName', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

    itemsSorted = await sut['applySort'](items, 'customerName', null);
    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
  });
});
