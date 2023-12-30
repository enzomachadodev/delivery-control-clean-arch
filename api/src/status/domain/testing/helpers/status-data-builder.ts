import { randomUUID } from 'crypto';
import { StatusOption, StatusProps } from '../../entities/status.entity';

type Props = {
  name?: StatusOption;
  orderId?: string;
  createdAt?: Date;
};
export function StatusDataBuilder(props: Props): StatusProps {
  return {
    name:
      props.name ?? (StatusOption[Math.floor(Math.random() * 4) + 1] as any),
    orderId: props.orderId ?? randomUUID(),
    createdAt: props.createdAt ?? new Date(),
  };
}
