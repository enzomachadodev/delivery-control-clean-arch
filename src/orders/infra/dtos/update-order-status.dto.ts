import { UpdateOrderStatusUseCase } from '@/orders/app/usecases/update-order-status.usecase';
import { IsOrderStatusHistoryValidator } from '@/orders/domain/validators/order.validator';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

export class UpdateOrderStatusDto
  implements Omit<UpdateOrderStatusUseCase.Input, 'orderId' | 'userId'>
{
  @ApiProperty({ description: 'New order status' })
  @IsString()
  @IsNotEmpty()
  @Validate(IsOrderStatusHistoryValidator)
  status: OrderStatus;
}
