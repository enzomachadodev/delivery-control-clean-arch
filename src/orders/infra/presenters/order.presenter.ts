import { OrderOutput } from '@/orders/app/dtos/order-output';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class OrderPresenter {
  @ApiProperty({ description: 'Order identification' })
  id: string;

  @ApiProperty({ description: 'Identification of the user creating the order' })
  userId: string;

  @ApiProperty({ description: 'Customer name' })
  customerName: string;

  @ApiProperty({ description: 'Customer street' })
  street: string;

  @ApiProperty({ description: 'Customer number' })
  number: number;

  @ApiProperty({ description: 'Customer complement' })
  complement: string | null;

  @ApiProperty({ description: 'Customer neighborhood' })
  neighborhood: string;

  @ApiProperty({ description: 'Customer city' })
  city: string;

  @ApiProperty({ description: 'Customer state' })
  state: string;

  @ApiProperty({ description: 'Customer zip code' })
  zipCode: string;

  @ApiProperty({ description: 'Current order status ' })
  @Transform(({ value }: { value: OrderStatus }) => OrderStatus[value])
  currentStatus: OrderStatus;

  @ApiProperty({ description: 'Order creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({ description: 'last order update' })
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
