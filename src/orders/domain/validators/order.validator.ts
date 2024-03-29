import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { OrderProps } from '../entities/order.entity';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

@ValidatorConstraint({ name: 'IsOrderStatus', async: false })
export class IsOrderStatusHistoryValidator
  implements ValidatorConstraintInterface
{
  //eslint-disable-next-line
  validate(name: any, args: ValidationArguments) {
    return Object.values(OrderStatus).includes(name);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a OrderStatus`;
  }
}

export class OrderRules {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  street: string;

  @IsNumber()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  number: number;

  @MaxLength(255)
  @IsOptional()
  @IsString()
  complement?: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 2, { message: 'state must be exactly 2 characters' })
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8, { message: 'zipCode must be exactly 8 characters' })
  @IsNumberString()
  zipCode: string;

  @IsNotEmpty()
  @Validate(IsOrderStatusHistoryValidator)
  currentStatus: OrderStatus;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor({
    userId,
    customerName,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
    currentStatus,
    createdAt,
    updatedAt,
  }: OrderProps) {
    Object.assign(this, {
      userId,
      customerName,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      currentStatus,
      createdAt,
      updatedAt,
    });
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
