import { faker } from '@faker-js/faker';
import { OrderProps } from '../../entities/order.entity';
import { randomUUID } from 'crypto';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

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
  currentStatus?: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
};
export function OrderDataBuilder(props: Props): OrderProps {
  return {
    userId: props.userId ?? randomUUID(),
    customerName: props.customerName ?? faker.person.fullName(),
    street: props.street ?? faker.location.street(),
    number: props.number ?? Number(faker.number.int({ max: 9999 })),
    complement: props.complement ?? faker.location.secondaryAddress(),
    neighborhood: props.neighborhood ?? faker.location.county(),
    city: props.city ?? faker.location.city(),
    state: props.state ?? faker.location.state({ abbreviated: true }),
    zipCode: props.zipCode ?? '01311-000',
    currentStatus: props.currentStatus ?? OrderStatus.CONFIRMED,
    createdAt: props.createdAt ?? new Date(),
    updatedAt: props.updatedAt ?? new Date(),
  };
}
