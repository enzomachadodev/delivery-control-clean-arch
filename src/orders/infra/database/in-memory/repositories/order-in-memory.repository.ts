import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { SearchInput } from '@/shared/app/dtos/search-input';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import {
  SearchResult,
  SortDirection,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export class OrderInMemoryRepository
  extends InMemorySearchableRepository<OrderEntity>
  implements OrderRepository.Repository
{
  sortableFields: string[] = ['customerName', 'createdAt', 'currentStatus'];
  async findByUserId(
    userId: string,
    params: SearchInput,
  ): Promise<SearchResult<OrderEntity>> {
    const entities = this.items.filter((item) => item.userId === userId);

    const itemsFiltered = await this.applyFilter(entities, params.filter);
    const itemsSorted = await this.applySort(
      itemsFiltered,
      params.sort,
      params.sortDir,
    );
    const itemsPaginated = await this.applyPaginate(
      itemsSorted,
      params.page,
      params.perPage,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: params.page,
      perPage: params.perPage,
      sort: params.sort,
      sortDir: params.sortDir,
      filter: params.filter,
    });
  }

  protected async applyFilter(
    items: OrderEntity[],
    filter: OrderRepository.Filter,
  ): Promise<OrderEntity[]> {
    if (!filter) return items;
    return items.filter((item) =>
      item.props.customerName
        .toLowerCase()
        .includes(filter.toLocaleLowerCase()),
    );
  }

  protected async applySort(
    items: OrderEntity[],
    sort: string,
    sortDir: SortDirection,
  ): Promise<OrderEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDir);
  }
}
