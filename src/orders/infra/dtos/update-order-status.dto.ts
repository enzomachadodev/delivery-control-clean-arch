import { UpdateOrderStatusUseCase } from '@/orders/app/usecases/update-order-status.usecase';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

export class UpdateOrderStatusDto
  implements Omit<UpdateOrderStatusUseCase.Input, 'orderId' | 'userId'>
{
  status: OrderStatus;
}
