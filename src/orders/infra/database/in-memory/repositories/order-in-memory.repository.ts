import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';

export class OrderInMemoryRepository
  extends InMemorySearchableRepository<OrderEntity>
  implements OrderRepository.Repository
{
  sortableFields: string[] = ['customerName', 'createdAt', 'currentStatus'];
  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const entities = this.items.filter((item) => item.userId === userId);
    return entities;
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
