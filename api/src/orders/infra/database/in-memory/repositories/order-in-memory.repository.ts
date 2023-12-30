import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';

export class OrderInMemoryRepository
  extends InMemoryRepository<OrderEntity>
  implements OrderRepository
{
  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const entities = this.items.filter((item) => item.userId === userId);
    return entities;
  }
}
