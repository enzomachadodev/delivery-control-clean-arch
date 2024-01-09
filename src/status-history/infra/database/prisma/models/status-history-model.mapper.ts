import { ValidationError } from '@/shared/domain/errors/validation-error';
import {
  OrderStatus,
  StatusHistoryEntity,
} from '@/status-history/domain/entities/status-history.entity';
import {
  StatusHistory,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client';

export class StatusHistoryModelMapper {
  static toEntity(model: StatusHistory) {
    const data = {
      status: this.mapPrismaOrderStatusToDomain(model.status),
      createdAt: model.createdAt,

      orderId: model.orderId,
    };

    try {
      return new StatusHistoryEntity(data, model.id);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }

  private static mapPrismaOrderStatusToDomain(
    prismaStatus: PrismaOrderStatus,
  ): OrderStatus {
    switch (prismaStatus) {
      case 'CONFIRMED':
        return OrderStatus.CONFIRMED;
      case 'PROCESSING':
        return OrderStatus.PROCESSING;
      case 'DISPATCHED':
        return OrderStatus.DISPATCHED;
      case 'DELIVERED':
        return OrderStatus.DELIVERED;
      case 'CANCELED':
        return OrderStatus.CANCELED;
      default:
        throw new Error(`Unexpected Prisma order status: ${prismaStatus}`);
    }
  }
}
