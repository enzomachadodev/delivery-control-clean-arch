import { OrderEntity } from '../entities/order.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace OrderRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams {}

  export class SearchResult extends DefaultSearchResult<OrderEntity, Filter> {}
  export interface Repository
    extends SearchableRepositoryInterface<
      OrderEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByUserId(userId: string): Promise<OrderEntity[]>;
  }
}
