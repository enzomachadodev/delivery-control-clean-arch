import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';

export namespace DeleteOrderUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private orderRepository: OrderRepository.Repository,
      private statusHistoryRepository: StatusHistoryRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      await this.statusHistoryRepository.deleteManyByOrderId(input.id);
      await this.orderRepository.delete(input.id);
    }
  }
}
