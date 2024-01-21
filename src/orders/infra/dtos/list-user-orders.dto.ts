import { ListUserOrdersUseCase } from '@/orders/app/usecases/list-user-orders.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListUserOrdersDto
  implements Omit<ListUserOrdersUseCase.Input, 'userId'>
{
  @ApiPropertyOptional({ description: 'Informed data to filter the result' })
  @IsOptional()
  filter?: string;

  @ApiPropertyOptional({ description: 'Page that will be returned' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Number of records per page' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description: 'Data ordering: ascending or descending',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description:
      'Column defined to order the data: "customerName" or "createdAt"',
  })
  @IsOptional()
  sortDir?: SortDirection;
}
