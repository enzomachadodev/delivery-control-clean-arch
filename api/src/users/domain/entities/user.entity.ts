import { Entity } from '@/shared/domain/entities/entity';
import { UserValidatorFactory } from '../validators/user.validator';

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

  private set password(value: string) {
    this.props.password = value;
  }

  private set updatedAt(value: Date) {
    this.props.updatedAt = value;
  }

  static validate(props: UserProps) {
    const validator = UserValidatorFactory.create();
    validator.validate(props);
  }
}
