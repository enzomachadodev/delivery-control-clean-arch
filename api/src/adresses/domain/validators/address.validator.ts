import {
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
import { AddressProps } from '../entities/address.entity';

export class AddressRules {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

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

  constructor({
    orderId,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
  }: AddressProps) {
    Object.assign(this, {
      orderId,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
    });
  }
}

export class AddressValidator extends ClassValidatorFields<AddressRules> {
  validate(data: AddressProps): boolean {
    return super.validate(new AddressRules(data || ({} as AddressProps)));
  }
}

export class AddressValidatorFactory {
  static create(): AddressValidator {
    return new AddressValidator();
  }
}
