import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OrderValidatorFactory } from '../validators/order.validator';

export type OrderProps = {
  customerName: string;
  userId: string;
  createdAt?: Date;
};

export class OrderEntity extends Entity<OrderProps> {
  constructor(
    public readonly props: OrderProps,
    id?: string,
  ) {
    OrderEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get customerName() {
    return this.props.customerName;
  }

  get userId() {
    return this.props.userId;
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
