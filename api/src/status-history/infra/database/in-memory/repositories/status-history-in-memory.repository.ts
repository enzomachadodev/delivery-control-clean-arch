import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository';
import { StatusHistoryEntity } from '@/status-history/domain/entities/status-history.entity';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';

export class StatusHistoryInMemoryRepository
  extends InMemoryRepository<StatusHistoryEntity>
  implements StatusHistoryRepository
{
  async findByOrderId(orderId: string): Promise<StatusHistoryEntity[]> {
    const entities = this.items.filter((item) => item.orderId === orderId);
    return entities;
  }
}
