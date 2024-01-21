import { OrdersController } from '../../orders.controller';
import { CreateOrderDto } from '../../dtos';
import { UpdateOrderStatusDto } from '../../dtos/update-order-status.dto';
import { CreateOrderUseCase } from '@/orders/app/usecases/create-order.usecase';
import { OrderOutput } from '@/orders/app/dtos/order-output';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { UpdateOrderStatusUseCase } from '@/orders/app/usecases/update-order-status.usecase';
import { GetOrderUseCase } from '@/orders/app/usecases/get-order.usecase';
import { randomUUID } from 'node:crypto';
import { OrderPresenter } from '../../presenters/order.presenter';

describe('OrdersController unit tests', () => {
  let sut: OrdersController;
  let id: string;
  let props: OrderOutput;

  beforeEach(async () => {
    sut = new OrdersController();
    id = 'df96ae94-6128-486e-840c-b6f78abb4801';
    props = {
      id,
      userId: randomUUID(),
      customerName: 'John Doe',
      currentStatus: OrderStatus.CONFIRMED,
      street: 'Street test',
      number: 1234,
      complement: 'Complement test',
      neighborhood: 'Neighborhood test',
      city: 'City test',
      state: 'State test',
      zipCode: '36570260',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a order', async () => {
    const output: CreateOrderUseCase.Output = props;
    const mockCreateOrderUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['createOrderUseCase'] = mockCreateOrderUseCase as any;
    const input: CreateOrderDto = {
      customerName: 'John Doe',
      street: 'Street test',
      number: 1234,
      complement: 'Complement test',
      neighborhood: 'Neighborhood test',
      city: 'City test',
      state: 'State test',
      zipCode: '36570260',
    };
    const presenter = await sut.createOrder(props.userId, input);
    expect(presenter).toBeInstanceOf(OrderPresenter);
    expect(presenter).toMatchObject(new OrderPresenter(output));
    expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith({
      ...input,
      userId: props.userId,
    });
  });

  it('should update a order status', async () => {
    const output: UpdateOrderStatusUseCase.Output = {
      ...props,
      currentStatus: OrderStatus.DISPATCHED,
    };
    const mockUpdateOrderStatusUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updateOrderStatusUseCase'] = mockUpdateOrderStatusUseCase as any;
    const input: UpdateOrderStatusDto = {
      status: OrderStatus.DISPATCHED,
    };
    const presenter = await sut.update(props.userId, id, input);
    expect(presenter).toBeInstanceOf(OrderPresenter);
    expect(presenter).toMatchObject(new OrderPresenter(output));
    expect(mockUpdateOrderStatusUseCase.execute).toHaveBeenCalledWith({
      userId: props.userId,
      orderId: id,
      ...input,
    });
  });

  it('should delete a order', async () => {
    const output = undefined;
    const mockDeleteOrderUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['deleteOrderUseCase'] = mockDeleteOrderUseCase as any;
    const result = await sut.remove(props.userId, id);
    expect(output).toStrictEqual(result);
    expect(mockDeleteOrderUseCase.execute).toHaveBeenCalledWith({
      orderId: id,
      userId: props.userId,
    });
  });

  it('should gets a order', async () => {
    const output: GetOrderUseCase.Output = props;
    const mockGetOrderUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['getOrderUseCase'] = mockGetOrderUseCase as any;
    const presenter = await sut.findOne(props.userId, id);
    expect(presenter).toBeInstanceOf(OrderPresenter);
    expect(presenter).toMatchObject(new OrderPresenter(output));
    expect(mockGetOrderUseCase.execute).toHaveBeenCalledWith({
      id,
      userId: props.userId,
    });
  });
});
