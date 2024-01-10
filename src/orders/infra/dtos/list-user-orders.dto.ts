import { ListUserOrdersUseCase } from '@/orders/app/usecases/list-user-orders.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { IsOptional } from 'class-validator';

export class ListUserOrdersDto
  implements Omit<ListUserOrdersUseCase.Input, 'userId'>
{
  @IsOptional()
  filter?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  perPage?: number;

  @IsOptional()
  sort?: string;

  @IsOptional()
  sortDir?: SortDirection;
}
