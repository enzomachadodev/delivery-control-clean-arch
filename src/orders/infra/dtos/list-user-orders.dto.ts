import { ListUserOrdersUseCase } from '@/orders/app/usecases/list-user-orders.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';

export class ListUserOrdersDto
  implements Omit<ListUserOrdersUseCase.Input, 'userId'>
{
  filter?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
}
