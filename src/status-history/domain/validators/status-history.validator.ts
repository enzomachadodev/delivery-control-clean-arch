import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import {
  OrderStatus,
  StatusHistoryProps,
} from '../entities/status-history.entity';
import { IsOrderStatusHistoryValidator } from '@/orders/domain/validators/order.validator';

export class StatusRules {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @Validate(IsOrderStatusHistoryValidator)
  @IsNotEmpty()
  status: OrderStatus;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ orderId, status, createdAt }: StatusHistoryProps) {
    Object.assign(this, { orderId, status, createdAt });
  }
}

export class StatusHistoryValidator extends ClassValidatorFields<StatusRules> {
  validate(data: StatusHistoryProps): boolean {
    return super.validate(new StatusRules(data || ({} as StatusHistoryProps)));
  }
}

export class StatusHistoryValidatorFactory {
  static create(): StatusHistoryValidator {
    return new StatusHistoryValidator();
  }
}
