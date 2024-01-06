import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UpdateOrderStatusUseCase } from '../../update-order-status.usecase';
import { OrderInMemoryRepository } from '@/orders/infra/database/in-memory/repositories/order-in-memory.repository';
import { StatusHistoryInMemoryRepository } from '@/status-history/infra/database/in-memory/repositories/status-history-in-memory.repository';
import {
  OrderStatus,
  StatusHistoryEntity,
} from '@/status-history/domain/entities/status-history.entity';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { UnauthorizedError } from '@/shared/app/errors/unauthorized-error';
import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';

describe('UpdateOrderStatusUseCase unit tests', () => {
  let sut: UpdateOrderStatusUseCase.UseCase;
  let orderRepository: OrderInMemoryRepository;
  let statusHistoryRepository: StatusHistoryInMemoryRepository;

  beforeEach(() => {
    orderRepository = new OrderInMemoryRepository();
    statusHistoryRepository = new StatusHistoryInMemoryRepository();
    sut = new UpdateOrderStatusUseCase.UseCase(
      orderRepository,
      statusHistoryRepository,
    );
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({
        orderId: 'fakeId',
        userId: 'user_id',
        status: OrderStatus.DELIVERED,
      }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should throws error when status not provided', async () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    orderRepository.items = [entity];
    await expect(() =>
      sut.execute({
        orderId: entity._id,
        userId: entity.userId,
        status: '' as any,
      }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));
  });

  it('Should throws error when userId not provided', async () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    orderRepository.items = [entity];
    await expect(() =>
      sut.execute({
        orderId: entity._id,
        userId: '',
        status: OrderStatus.DISPATCHED,
      }),
    ).rejects.toThrow(new BadRequestError('Input data not provided'));
  });

  it('Should throws error when entity belongs to another user', async () => {
    orderRepository.items = [new OrderEntity(OrderDataBuilder({}))];
    await expect(() =>
      sut.execute({
        orderId: orderRepository.items[0]._id,
        userId: 'fake_id',
        status: OrderStatus.DELIVERED,
      }),
    ).rejects.toThrow(new UnauthorizedError('Insufficient permission'));
  });

  it('Should throws error when current status of entity is "DELIVERED"', async () => {
    const orderEntity = new OrderEntity(
      OrderDataBuilder({ currentStatus: OrderStatus.DELIVERED }),
    );
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
    await expect(() =>
      sut.execute({
        orderId: orderItems[0]._id,
        userId: orderItems[0].userId,
        status: OrderStatus.CONFIRMED,
      }),
    ).rejects.toThrow(new BadRequestError('Order has already been finalized'));
  });

  it('Should throws error when current status of entity is "CANCELED"', async () => {
    const orderEntity = new OrderEntity(
      OrderDataBuilder({ currentStatus: OrderStatus.CANCELED }),
    );
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
    await expect(() =>
      sut.execute({
        orderId: orderItems[0]._id,
        userId: orderItems[0].userId,
        status: OrderStatus.CONFIRMED,
      }),
    ).rejects.toThrow(new BadRequestError('Order has already been finalized'));
  });

  it('Should throws error when entity has the same status of the provided status', async () => {
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
    await expect(() =>
      sut.execute({
        orderId: orderItems[0]._id,
        userId: orderItems[0].userId,
        status: orderItems[0].currentStatus,
      }),
    ).rejects.toThrow(
      new BadRequestError('Order already has the current status'),
    );
  });

  it('Should be able to update order status', async () => {
    const spyUpdate = jest.spyOn(orderRepository, 'update');
    const spyInsert = jest.spyOn(statusHistoryRepository, 'insert');
    const orderEntity = new OrderEntity(OrderDataBuilder({}));
    const orderItems = [orderEntity];
    orderRepository.items = orderItems;
    const statusHistoryItems = [
      new StatusHistoryEntity(
        StatusHistoryDataBuilder({
          orderId: orderEntity._id,
          status: orderEntity.currentStatus,
        }),
      ),
    ];
    statusHistoryRepository.items = statusHistoryItems;
    expect(orderRepository.items).toHaveLength(1);
    expect(statusHistoryRepository.items).toHaveLength(1);
    await sut.execute({
      orderId: orderItems[0]._id,
      userId: orderItems[0].userId,
      status: OrderStatus.CANCELED,
    });
    expect(statusHistoryRepository.items).toHaveLength(2);
    expect(statusHistoryRepository.items[1]).toEqual(
      expect.objectContaining({
        status: OrderStatus.CANCELED,
      }),
    );
    expect(orderRepository.items[0].currentStatus).toEqual(
      OrderStatus.CANCELED,
    );
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(spyInsert).toHaveBeenCalledTimes(1);
  });
});
