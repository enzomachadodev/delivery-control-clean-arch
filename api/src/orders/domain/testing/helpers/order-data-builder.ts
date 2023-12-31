import { faker } from '@faker-js/faker';
import { OrderProps } from '../../entities/order.entity';
import { randomUUID } from 'crypto';

type Props = {
  userId?: string;
  customerName?: string;
  street?: string;
  number?: number;
  complement?: string | null;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  createdAt?: Date;
};
export function OrderDataBuilder(props: Props): OrderProps {
  return {
    userId: props.userId ?? randomUUID(),
    customerName: props.customerName ?? faker.person.fullName(),
    street: faker.location.street(),
    number: Number(faker.number.int({ max: 9999 })),
    complement: faker.location.secondaryAddress(),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: '01311-000',
    createdAt: props.createdAt ?? new Date(),
  };
}
