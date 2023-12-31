import { RepositoryInterface } from '@/shared/domain/repositories/repository-contracts';
import { AddressEntity } from '../entities/address.entity';

export interface AddressRepository extends RepositoryInterface<AddressEntity> {
  getByOrderId(orderId: string): Promise<AddressEntity>;
}
