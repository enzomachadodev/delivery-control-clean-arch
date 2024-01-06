import {
  OrderStatus,
  StatusHistoryEntity,
} from '@/status-history/domain/entities/status-history.entity';

export type StatusHistoryOutput = {
  id: string;
  orderId: string;
  status: OrderStatus;
  createdAt: Date;
};

export class StatusHistoryOutputMapper {
  static toOutput(entity: StatusHistoryEntity): StatusHistoryOutput {
    return entity.toJSON();
  }
}
