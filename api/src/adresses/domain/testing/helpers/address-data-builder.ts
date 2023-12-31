import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { AddressProps } from '../../entities/address.entity';

type Props = {
  orderId?: string;
  street?: string;
  number?: number;
  complement?: string | null;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};
export function AddressDataBuilder(props: Props): AddressProps {
  return {
    orderId: props.orderId ?? randomUUID(),
    street: faker.location.street(),
    number: Number(faker.number.int({ max: 9999 })),
    complement: faker.location.secondaryAddress(),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: '01311-000',
  };
}
