import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { Order, OrderStatus as PrismaOrderStatus } from '@prisma/client';

export class OrderModelMapper {
  static toEntity(model: Order) {
    const data = {
      customerName: model.customerName,
      street: model.street,
      number: model.number,
      complement: model.complement,
      neighborhood: model.neighborhood,
      city: model.city,
      state: model.state,
      zipCode: model.zipCode,
      currentStatus: this.mapPrismaOrderStatusToDomain(model.currentStatus),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      userId: model.userId,
    };

    try {
      return new OrderEntity(data, model.id);
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
