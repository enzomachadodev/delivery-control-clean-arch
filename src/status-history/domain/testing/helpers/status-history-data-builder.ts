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
    status: props.status ?? OrderStatus.DELIVERED,
    createdAt: props.createdAt ?? new Date(),
  };
}
