import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import {
  OrderStatus,
  StatusHistoryProps,
} from '../entities/status-history.entity';

@ValidatorConstraint({ name: 'IsOrderStatus', async: false })
export class IsOrderStatusValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line
  validate(name: any, args: ValidationArguments) {
    return Object.values(OrderStatus).includes(name);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a OrderStatus`;
  }
}

export class StatusRules {
  @IsString()
  @Validate(IsOrderStatusValidator)
  @IsNotEmpty()
  status: OrderStatus;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ status, orderId, createdAt }: StatusHistoryProps) {
    Object.assign(this, { status, orderId, createdAt });
  }
}

export class StatusValidator extends ClassValidatorFields<StatusRules> {
  validate(data: StatusHistoryProps): boolean {
    return super.validate(new StatusRules(data || ({} as StatusHistoryProps)));
  }
}

export class StatusValidatorFactory {
  static create(): StatusValidator {
    return new StatusValidator();
  }
}
