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
  UseGuards,
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
import { AuthGuard } from '@/auth/infra/auth.guard';
import { GetUser } from '@/auth/infra/decorator/get-user.decorator';

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
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    const output = await this.createOrderUseCase.execute({
      ...createOrderDto,
      userId,
    });
    return OrdersController.orderToResponse(output);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findByUser(
    @GetUser('id') userId: string,
    @Query() searchParams: ListUserOrdersDto,
  ) {
    const output = await this.listUserOrdersUseCase.execute({
      userId,
      ...searchParams,
    });
    return OrdersController.listOrdersToResponse(output);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    const output = await this.getOrderUseCase.execute({ id, userId });
    return OrdersController.orderToResponse(output);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    const output = await this.updateOrderStatusUseCase.execute({
      userId,
      orderId: id,
      status: updateOrderDto.status,
    });
    return OrdersController.orderToResponse(output);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.deleteOrderUseCase.execute({ orderId: id, userId });
  }
}
