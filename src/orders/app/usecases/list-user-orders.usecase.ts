import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { SearchInput } from '@/shared/app/dtos/search-input';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/app/dtos/pagination-output';
import { OrderOutput, OrderOutputMapper } from '../dtos/order-output';

export namespace ListUserOrdersUseCase {
  export type Input = SearchInput & {
    userId: string;
  };

  export type Output = PaginationOutput<OrderOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private orderRepository: OrderRepository.Repository) {}
    async execute(input: Input): Promise<Output> {
      const { userId, ...search } = input;
      const params = new OrderRepository.SearchParams(search);
      const searchResult = await this.orderRepository.findByUserId(
        userId,
        params,
      );
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: OrderRepository.SearchResult): Output {
      const items = searchResult.items.map((item) =>
        OrderOutputMapper.toOutput(item),
      );

      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
