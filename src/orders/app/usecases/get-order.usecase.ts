import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { UnauthorizedError } from '@/shared/app/errors/unauthorized-error';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';

export namespace GetOrderUseCase {
  export type Input = {
    id: string;
    userId: string;
  };

  export type Output = OrderOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private orderRepository: OrderRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { userId, id } = input;
      if (!userId) throw new BadRequestError('Input data not provided');
      const orderEntity = await this.orderRepository.findById(id);

      if (orderEntity.userId !== userId)
        throw new UnauthorizedError('Insufficient permission');

      return OrderOutputMapper.toOutput(orderEntity);
    }
  }
}
