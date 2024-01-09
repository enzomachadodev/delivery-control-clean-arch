import { CollectionPresenter } from '@/shared/infra/presenters/collection.presenter';
import { OrderPresenter } from './order.presenter';
import { ListUserOrdersUseCase } from '@/orders/app/usecases/list-user-orders.usecase';

export class OrderCollectionPresenter extends CollectionPresenter {
  data: OrderPresenter[];

  constructor(output: ListUserOrdersUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new OrderPresenter(item));
  }
}
