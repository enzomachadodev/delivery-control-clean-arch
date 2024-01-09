import { CreateOrderUseCase } from '@/orders/app/usecases/create-order.usecase';

export class CreateOrderDto implements CreateOrderUseCase.Input {
  userId: string;
  customerName: string;
  street: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}
