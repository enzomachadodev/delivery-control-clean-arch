import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';
import { OrderProps } from '../entities/order.entity';

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
  @Matches(/^\d{5}-\d{3}$/, {
    message: 'zipCode should match the pattern XXXXX-XXX',
  })
  zipCode: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

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
    createdAt,
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
      createdAt,
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
