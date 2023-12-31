import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { AddressValidatorFactory } from '../validators/address.validator';

export type AddressProps = {
  orderId: string;
  street: string;
  number: number;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

export class AddressEntity extends Entity<AddressProps> {
  constructor(
    public readonly props: AddressProps,
    id?: string,
  ) {
    AddressEntity.validate(props);
    super(props, id);
    this.props.complement = this.props.complement ?? null;
  }

  get orderId() {
    return this.props.orderId;
  }

  get street() {
    return this.props.street;
  }

  get number() {
    return this.props.number;
  }
  get complement() {
    return this.props.complement;
  }
  get neighborhood() {
    return this.props.neighborhood;
  }
  get city() {
    return this.props.city;
  }
  get state() {
    return this.props.state;
  }
  get zipCode() {
    return this.props.zipCode;
  }

  static validate(props: AddressProps) {
    const validator = AddressValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
