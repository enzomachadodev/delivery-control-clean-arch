import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository';

export class OrderInMemoryRepository
  extends InMemorySearchableRepository<OrderEntity>
  implements OrderRepository
{
  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const entities = this.items.filter((item) => item.userId === userId);
    return entities;
  }
}
