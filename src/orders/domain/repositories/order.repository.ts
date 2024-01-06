import { OrderEntity } from '../entities/order.entity';
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contracts';

export interface OrderRepository
  extends SearchableRepositoryInterface<OrderEntity, any, any> {
  findByUserId(userId: string): Promise<OrderEntity[]>;
}
