import { Entity } from '@/shared/domain/entities/entity';
import { UserValidatorFactory } from '../validators/user.validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserEntity extends Entity<UserProps> {
  constructor(
    public readonly props: UserProps,
    id?: string,
  ) {
    UserEntity.validate(props);
    super(props, id);
    this.props.createdAt = this.props.createdAt ?? new Date();
    this.props.updatedAt = this.props.updatedAt ?? new Date();
  }

  update(data: Partial<UserProps>): void {
    const updatedData: UserProps = { ...this.props, ...data };
    UserEntity.validate(updatedData);
    this.props.name = updatedData.name;
    this.props.email = updatedData.email;
    this.props.password = updatedData.password;
    this.props.updatedAt = new Date();
  }

  updatePassword(value: string): void {
    UserEntity.validate({
      ...this.props,
      password: value,
    });
    this.password = value;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  private set email(value: string) {
    this.props.email = value;
  }

  private set password(value: string) {
    this.props.password = value;
  }

  private set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
