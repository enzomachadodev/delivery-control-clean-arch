import { CreateOrderUseCase } from '@/orders/app/usecases/create-order.usecase';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';

export class CreateOrderDto
  implements Omit<CreateOrderUseCase.Input, 'userId'>
{
  @ApiProperty({ description: 'Order customer name' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: 'Customer street' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Customer number' })
  @IsNumber()
  @IsNotEmpty()
  number: number;

  @ApiProperty({ description: 'Customer complement' })
  @IsString()
  @IsOptional()
  complement?: string;

  @ApiProperty({ description: 'Customer neighborhood' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'Customer city' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Customer state' })
  @IsString()
  @IsNotEmpty()
  @Length(2)
  @IsUppercase()
  state: string;

  @ApiProperty({ description: 'Customer zip code' })
  @IsString()
  @IsNotEmpty()
  @Length(8)
  @IsNumberString()
  zipCode: string;
}
