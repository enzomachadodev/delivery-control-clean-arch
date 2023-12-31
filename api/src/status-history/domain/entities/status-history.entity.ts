import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { StatusHistoryValidatorFactory } from '../validators/status-history.validator';

export enum OrderStatus {
  CONFIRMED,
  PROCESSING,
  DISPATCHED,
  DELIVERED,
  CANCELED,
}

export type StatusHistoryProps = {
  status: OrderStatus;
  orderId: string;
  createdAt?: Date;
};

export class StatusHistoryEntity extends Entity<StatusHistoryProps> {
  constructor(
    public readonly props: StatusHistoryProps,
    id?: string,
  ) {
    StatusHistoryEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get orderId() {
    return this.props.orderId;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static validate(props: StatusHistoryProps) {
    const validator = StatusHistoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
