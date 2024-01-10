import { UpdateOrderStatusUseCase } from '@/orders/app/usecases/update-order-status.usecase';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto
  implements Omit<UpdateOrderStatusUseCase.Input, 'orderId' | 'userId'>
{
  @IsString()
  @IsNotEmpty()
  status: OrderStatus;
}
