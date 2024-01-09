import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';
import { UnauthorizedError } from '@/shared/app/errors/unauthorized-error';

export namespace DeleteOrderUseCase {
  export type Input = {
    userId: string;
    orderId: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private orderRepository: OrderRepository.Repository,
      private statusHistoryRepository: StatusHistoryRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { orderId, userId } = input;
      if (!userId) {
        throw new BadRequestError('Input data not provided');
      }

      const orderEntity = await this.orderRepository.findById(orderId);

      if (orderEntity.userId !== userId)
        throw new UnauthorizedError('Insufficient permission');

      await this.statusHistoryRepository.deleteManyByOrderId(orderId);
      await this.orderRepository.delete(orderId);
    }
  }
}
