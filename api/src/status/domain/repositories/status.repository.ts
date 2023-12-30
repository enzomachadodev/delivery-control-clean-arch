import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { StatusEntity } from '../entities/status.entity';

export interface StatusRepository extends RepositoryInterface<StatusEntity> {
  findByOrderId(orderId: string): Promise<StatusEntity[]>;
}
