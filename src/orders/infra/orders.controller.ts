import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../app/usecases/create-order.usecase';
import { GetOrderUseCase } from '../app/usecases/get-order.usecase';
import { UpdateOrderStatusUseCase } from '../app/usecases/update-order-status.usecase';
import { ListUserOrdersUseCase } from '../app/usecases/list-user-orders.usecase';
import { DeleteOrderUseCase } from '../app/usecases/delete-order.usecase';
import {
  CreateOrderDto,
  ListUserOrdersDto,
  UpdateOrderStatusDto,
} from './dtos';
import { OrderOutput } from '../app/dtos/order-output';
import { OrderPresenter } from './presenters/order.presenter';
import { OrderCollectionPresenter } from './presenters/order-collection.presenter';

@Controller('orders')
export class OrdersController {
  @Inject(CreateOrderUseCase.UseCase)
  private createOrderUseCase: CreateOrderUseCase.UseCase;

  @Inject(GetOrderUseCase.UseCase)
  private getOrderUseCase: GetOrderUseCase.UseCase;

  @Inject(UpdateOrderStatusUseCase.UseCase)
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase.UseCase;

  @Inject(ListUserOrdersUseCase.UseCase)
  private listUserOrdersUseCase: ListUserOrdersUseCase.UseCase;

  @Inject(DeleteOrderUseCase.UseCase)
  private deleteOrderUseCase: DeleteOrderUseCase.UseCase;

  static orderToResponse(output: OrderOutput) {
    return new OrderPresenter(output);
  }

  static listOrdersToResponse(output: ListUserOrdersUseCase.Output) {
    return new OrderCollectionPresenter(output);
  }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const userId = 'string';
    const output = await this.createOrderUseCase.execute({
      ...createOrderDto,
      userId,
    });
    return OrdersController.orderToResponse(output);
  }

  @Get()
  async findByUser(@Query() searchParams: ListUserOrdersDto) {
    const userId = 'string';
    const output = await this.listUserOrdersUseCase.execute({
      userId,
      ...searchParams,
    });
    return OrdersController.listOrdersToResponse(output);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userId = 'string';
    const output = await this.getOrderUseCase.execute({ id, userId });
    return OrdersController.orderToResponse(output);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    const userId = 'string';
    const output = await this.updateOrderStatusUseCase.execute({
      userId,
      orderId: id,
      status: updateOrderDto.status,
    });
    return OrdersController.orderToResponse(output);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const userId = 'string';
    return this.deleteOrderUseCase.execute({ orderId: id, userId });
  }
}
