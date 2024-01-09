import { OrderOutput } from '@/orders/app/dtos/order-output';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { Transform } from 'class-transformer';

export class OrderPresenter {
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

  @Transform(({ value }: { value: OrderStatus }) => OrderStatus[value])
  currentStatus: OrderStatus;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(output: OrderOutput) {
    this.id = output.id;
    this.userId = output.userId;
    this.customerName = output.customerName;
    this.street = output.street;
    this.number = output.number;
    this.complement = output.complement;
    this.neighborhood = output.neighborhood;
    this.city = output.city;
    this.state = output.state;
    this.zipCode = output.zipCode;
    this.currentStatus = output.currentStatus;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}
