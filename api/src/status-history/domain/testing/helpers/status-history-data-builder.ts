import { randomUUID } from 'crypto';
import {
  OrderStatus,
  StatusHistoryProps,
} from '../../entities/status-history.entity';

type Props = {
  status?: OrderStatus;
  orderId?: string;
  createdAt?: Date;
};
export function StatusHistoryDataBuilder(props: Props): StatusHistoryProps {
  return {
    orderId: props.orderId ?? randomUUID(),
    status:
      props.status ?? (OrderStatus[Math.floor(Math.random() * 4) + 1] as any),
    createdAt: props.createdAt ?? new Date(),
  };
}
