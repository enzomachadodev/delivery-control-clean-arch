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
import { StatusOption, StatusProps } from '../entities/status.entity';

@ValidatorConstraint({ name: 'IsStatusOption', async: false })
export class IsStatusOptionValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line
  validate(name: any, args: ValidationArguments) {
    return Object.values(StatusOption).includes(name);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a StatusOption`;
  }
}

export class StatusRules {
  @IsString()
  @Validate(IsStatusOptionValidator)
  @IsNotEmpty()
  name: StatusOption;

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ name, orderId, createdAt }: StatusProps) {
    Object.assign(this, { name, orderId, createdAt });
  }
}

export class StatusValidator extends ClassValidatorFields<StatusRules> {
  validate(data: StatusProps): boolean {
    return super.validate(new StatusRules(data || ({} as StatusProps)));
  }
}

export class StatusValidatorFactory {
  static create(): StatusValidator {
    return new StatusValidator();
  }
}
