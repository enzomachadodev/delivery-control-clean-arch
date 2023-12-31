import { BadRequestError } from '@/shared/app/errors/bad-request-error';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import {
  OrderStatus,
  StatusHistoryEntity,
} from '@/status-history/domain/entities/status-history.entity';

export namespace CreateOrderUseCase {
  export type Input = {
    userId: string;
    customerName: string;
    street: string;
    number: number;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };

  export type Output = OrderOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private orderRepository: OrderRepository,
      private userRepository: UserRepository,
      private statusHistoryRepository: StatusHistoryRepository,
    ) {}
    async execute(input: Input): Promise<Output> {
      const {
        userId,
        customerName,
        street,
        number,
        neighborhood,
        city,
        state,
        zipCode,
      } = input;

      if (
        !userId ||
        !customerName ||
        !street ||
        !number ||
        !neighborhood ||
        !city ||
        !state ||
        !zipCode
      )
        throw new BadRequestError('Input data not provided');

      await this.userRepository.findById(userId);

      const status = OrderStatus.CONFIRMED;

      const orderEntity = new OrderEntity(
        Object.assign({ ...input, currentStatus: status }),
      );

      await this.orderRepository.insert(orderEntity);

      const statusHistoryEntity = new StatusHistoryEntity({
        orderId: orderEntity._id,
        status,
      });

      await this.statusHistoryRepository.insert(statusHistoryEntity);

      return OrderOutputMapper.toOutput(orderEntity);
    }
  }
}
