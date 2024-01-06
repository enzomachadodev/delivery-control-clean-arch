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

  async deleteManyByOrderId(orderId: string): Promise<void> {
    const indexesToDelete: number[] = [];

    this.items.forEach((item, index) => {
      if (item.orderId === orderId) {
        indexesToDelete.push(index);
      }
    });

    indexesToDelete.reverse().forEach((index) => {
      this.items.splice(index, 1);
    });
  }
}
