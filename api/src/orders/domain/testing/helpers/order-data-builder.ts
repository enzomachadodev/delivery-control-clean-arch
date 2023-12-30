import { faker } from '@faker-js/faker';
import { OrderProps } from '../../entities/order.entity';
import { randomUUID } from 'crypto';

type Props = {
  customerName?: string;
  userId?: string;
  createdAt?: Date;
};
export function OrderDataBuilder(props: Props): OrderProps {
  return {
    customerName: props.customerName ?? faker.person.fullName(),
    userId: props.userId ?? randomUUID(),
    createdAt: props.createdAt ?? new Date(),
  };
}
