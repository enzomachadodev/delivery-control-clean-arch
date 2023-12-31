import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OrderValidatorFactory } from '../validators/order.validator';

export type OrderProps = {
  userId: string;
  customerName: string;
  street: string;
  number: number;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt?: Date;
};

export class OrderEntity extends Entity<OrderProps> {
  constructor(
    public readonly props: OrderProps,
    id?: string,
  ) {
    OrderEntity.validate(props);
    super(props, id);
    this.props.complement = this.props.complement ?? null;
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get userId() {
    return this.props.userId;
  }

  get customerName() {
    return this.props.customerName;
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

  get createdAt() {
    return this.props.createdAt;
  }

  static validate(props: OrderProps) {
    const validator = OrderValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
