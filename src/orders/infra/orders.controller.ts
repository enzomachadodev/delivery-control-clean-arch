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

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    const userId = 'string';
    console.log(this.createOrderUseCase, '@@@@@@@@@@@@2');
    return this.createOrderUseCase.execute({ ...createOrderDto, userId });
  }

  @Get()
  findByUser(@Query() searchParams: ListUserOrdersDto) {
    const userId = 'string';
    return this.listUserOrdersUseCase.execute({ userId, ...searchParams });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'string';
    return this.getOrderUseCase.execute({ id, userId });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    const userId = 'string';
    return this.updateOrderStatusUseCase.execute({
      userId,
      orderId: id,
      status: updateOrderDto.status,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 'string';
    return this.deleteOrderUseCase.execute({ orderId: id, userId });
  }
}
