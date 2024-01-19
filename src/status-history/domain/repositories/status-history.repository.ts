import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { StatusHistoryEntity } from '../entities/status-history.entity';

export interface StatusHistoryRepository
  extends Omit<
    RepositoryInterface<StatusHistoryEntity>,
    'findById' | 'update' | 'findAll' | 'delete'
  > {
  findByOrderId(orderId: string): Promise<StatusHistoryEntity[]>;
  deleteManyByOrderId(orderId: string): Promise<void>;
}
