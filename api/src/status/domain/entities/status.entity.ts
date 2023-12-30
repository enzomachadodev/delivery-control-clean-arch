import { Entity } from '@/shared/domain/entities/entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { StatusValidatorFactory } from '../validators/status.validator';

export enum StatusOption {
  CONFIRMED,
  PROCESSING,
  DISPATCHED,
  DELIVERED,
  CANCELED,
}

export type StatusProps = {
  name: StatusOption;
  orderId: string;
  createdAt?: Date;
};

export class StatusEntity extends Entity<StatusProps> {
  constructor(
    public readonly props: StatusProps,
    id?: string,
  ) {
    StatusEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
  }

  get name() {
    return this.props.name;
  }

  get orderId() {
    return this.props.orderId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static validate(props: StatusProps) {
    const validator = StatusValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
