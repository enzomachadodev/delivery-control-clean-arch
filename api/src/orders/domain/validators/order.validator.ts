import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { OrderProps } from '../entities/order.entity';

export class OrderRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ customerName, userId, createdAt }: OrderProps) {
    Object.assign(this, { customerName, userId, createdAt });
  }
}

export class OrderValidator extends ClassValidatorFields<OrderRules> {
  validate(data: OrderProps): boolean {
    return super.validate(new OrderRules(data || ({} as OrderProps)));
  }
}

export class OrderValidatorFactory {
  static create(): OrderValidator {
    return new OrderValidator();
  }
}
