import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { StatusEntity } from '@/status/domain/entities/status.entity';
import { StatusRepository } from '@/status/domain/repositories/status.repository';

export class StatusInMemoryRepository
  extends InMemoryRepository<StatusEntity>
  implements StatusRepository
{
  async findByOrderId(orderId: string): Promise<StatusEntity[]> {
    const entities = this.items.filter((item) => item.orderId === orderId);
    return entities;
  }
}
