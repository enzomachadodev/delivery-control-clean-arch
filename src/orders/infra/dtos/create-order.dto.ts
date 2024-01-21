import { CreateOrderUseCase } from '@/orders/app/usecases/create-order.usecase';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  IsUppercase,
  Length,
} from 'class-validator';

export class CreateOrderDto implements CreateOrderUseCase.Input {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsOptional()
  complement?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  @Length(2)
  @IsUppercase()
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(8)
  @IsNumberString()
  zipCode: string;
}
