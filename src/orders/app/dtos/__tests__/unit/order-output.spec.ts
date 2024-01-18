import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderOutputMapper } from '../../order-output';

describe('OrderOutputMapper unit tests', () => {
  it('should convert a user in output', () => {
    const entity = new OrderEntity(OrderDataBuilder({}));
    const spyToJson = jest.spyOn(entity, 'toJSON');
    const sut = OrderOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(entity.toJSON());
  });
});
