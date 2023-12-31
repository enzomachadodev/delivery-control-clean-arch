import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OrderValidatorFactory } from '../validators/order.validator';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

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
  currentStatus: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
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
    this.props.updatedAt = this.props.updatedAt ?? new Date();
  }

  updateStatus(value: OrderStatus): void {
    OrderEntity.validate({
      ...this.props,
      currentStatus: value,
    });
    this.currentStatus = value;
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

  get currentStatus() {
    return this.props.currentStatus;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private set currentStatus(value: OrderStatus) {
    this.props.currentStatus = value;
  }

  static validate(props: OrderProps) {
    const validator = OrderValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
