import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import {
  StatusHistoryOutput,
  StatusHistoryOutputMapper,
} from '@/status-history/app/dtos/status-history-output';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';
import { UnauthorizedError } from '@/shared/app/errors/unauthorized-error';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';

export namespace GetOrderUseCase {
  export type Input = {
    id: string;
    userId: string;
  };

  export type Output = OrderOutput & {
    statusHistory: StatusHistoryOutput[];
  };

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private orderRepository: OrderRepository.Repository,
      private statusHistoryRepository: StatusHistoryRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      if (!input.userId) throw new BadRequestError('Input data not provided');
      const orderEntity = await this.orderRepository.findById(input.id);

      if (orderEntity.userId !== input.userId)
        throw new UnauthorizedError('Insufficient permission');
      const statusHistoryEntities =
        await this.statusHistoryRepository.findByOrderId(input.id);

      const order = OrderOutputMapper.toOutput(orderEntity);
      console.log(order);
      const statusHistory = statusHistoryEntities.map(
        StatusHistoryOutputMapper.toOutput,
      );
      return { ...order, statusHistory };
    }
  }
}
