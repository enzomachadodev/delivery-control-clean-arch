import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';
import {
  OrderStatus,
  StatusHistoryEntity,
} from '@/status-history/domain/entities/status-history.entity';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { UnauthorizedError } from '@/shared/app/errors/unauthorized-error';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';

export namespace UpdateOrderStatusUseCase {
  export type Input = {
    orderId: string;
    userId: string;
    status: OrderStatus;
  };

  export type Output = OrderOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private orderRepository: OrderRepository,
      private statusHistoryRepository: StatusHistoryRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { orderId, userId, status } = input;
      if (
        !userId ||
        status === undefined ||
        status === null ||
        status === ('' as any)
      ) {
        throw new BadRequestError('Input data not provided');
      }

      const orderEntity = await this.orderRepository.findById(orderId);

      if (orderEntity.userId !== userId)
        throw new UnauthorizedError('Insufficient permission');

      if (
        orderEntity.currentStatus === OrderStatus.CANCELED ||
        orderEntity.currentStatus === OrderStatus.DELIVERED
      )
        throw new BadRequestError('Order has already been finalized');

      if (orderEntity.currentStatus === status)
        throw new BadRequestError('Order already has the current status');

      orderEntity.updateStatus(status);

      await this.orderRepository.update(orderEntity);

      const statusHistoryEntity = new StatusHistoryEntity({
        orderId: orderEntity._id,
        status,
      });

      await this.statusHistoryRepository.insert(statusHistoryEntity);

      return OrderOutputMapper.toOutput(orderEntity);
    }
  }
}
