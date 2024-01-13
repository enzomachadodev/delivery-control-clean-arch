import { OrdersController } from '../../orders.controller';
import { CreateOrderDto } from '../../dtos';
import { UpdateOrderStatusDto } from '../../dtos/update-order-status.dto';
import { CreateOrderUseCase } from '@/orders/app/usecases/create-order.usecase';
import { OrderOutput } from '@/orders/app/dtos/order-output';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { UpdateOrderStatusUseCase } from '@/orders/app/usecases/update-order-status.usecase';
import { GetOrderUseCase } from '@/orders/app/usecases/get-order.usecase';
import { randomUUID } from 'node:crypto';

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
      userId: props.userId,
      customerName: 'John Doe',
      street: 'Street test',
      number: 1234,
      complement: 'Complement test',
      neighborhood: 'Neighborhood test',
      city: 'City test',
      state: 'State test',
      zipCode: '36570260',
    };
    const result = await sut.create(input);
    expect(output).toMatchObject(result);
    expect(mockCreateOrderUseCase.execute).toHaveBeenCalledWith(input);
  });

  it('should update a order status', async () => {
    const output: UpdateOrderStatusUseCase.Output = props;
    const mockUpdateOrderStatusUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['updateOrderStatusUseCase'] = mockUpdateOrderStatusUseCase as any;
    const input: UpdateOrderStatusDto = {
      status: OrderStatus.CONFIRMED,
    };
    const result = await sut.update(id, input);
    expect(output).toMatchObject(result);
    expect(mockUpdateOrderStatusUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });
  });

  it('should delete a order', async () => {
    const output = undefined;
    const mockDeleteOrderUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['deleteOrderUseCase'] = mockDeleteOrderUseCase as any;
    const result = await sut.remove(id);
    expect(output).toStrictEqual(result);
    expect(mockDeleteOrderUseCase.execute).toHaveBeenCalledWith({
      id,
    });
  });

  it('should gets a order', async () => {
    const output: GetOrderUseCase.Output = {
      ...props,
      statusHistory: [
        {
          id: randomUUID(),
          status: OrderStatus.CONFIRMED,
          createdAt: props.createdAt,
          orderId: props.id,
        },
      ],
    };
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['getUserUseCase'] = mockGetUserUseCase as any;
    const result = await sut.findOne(id);
    expect(output).toStrictEqual(result);
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({
      id,
    });
  });
});
