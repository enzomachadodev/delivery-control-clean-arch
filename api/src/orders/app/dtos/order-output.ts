import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

export type OrderOutput = {
  id: string;
  userId: string;
  customerName: string;
  street: string;
  number: number;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  currentStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class OrderOutputMapper {
  static toOutput(entity: OrderEntity): OrderOutput {
    return entity.toJSON();
  }
}
