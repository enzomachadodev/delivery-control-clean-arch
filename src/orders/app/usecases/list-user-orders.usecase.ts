import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderOutput } from '../dtos/order-output';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';

export namespace ListUserOrdersUseCase {
  export type Input = {
    userId: string;
  };

  export type Output = OrderOutput[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private orderRepository: OrderRepository.Repository) {}
    execute(input: Input): Promise<Output> {
      return this.orderRepository.findByUserId(input.userId);
    }
  }
}
