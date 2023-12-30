import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { OrderEntity } from '../entities/order.entity';

export interface OrderRepository extends RepositoryInterface<OrderEntity> {
  findByUserId(userId: string): Promise<OrderEntity[]>;
}
