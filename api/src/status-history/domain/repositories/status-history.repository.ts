import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { StatusHistoryEntity } from '../entities/status-history.entity';

export interface StatusHistoryRepository
  extends RepositoryInterface<StatusHistoryEntity> {
  findByOrderId(orderId: string): Promise<StatusHistoryEntity[]>;
  deleteManyByOrderId(orderId: string): Promise<void>;
}
