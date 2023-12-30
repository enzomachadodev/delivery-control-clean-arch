import { OrderEntity, OrderProps } from '../../order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

describe('OrderEntity unit tests', () => {
  let props: OrderProps;
  let sut: OrderEntity;
  beforeEach(() => {
    OrderEntity.validate = jest.fn();
    props = OrderDataBuilder({});
    sut = new OrderEntity(props);
  });
  it('Constructor method', () => {
    expect(OrderEntity.validate).toHaveBeenCalled();
    expect(sut.props.customerName).toEqual(props.customerName);
    expect(sut.props.userId).toEqual(props.userId);
    expect(sut.props.createdAt).toEqual(expect.any(Date));
  });

  it('Getter of customerName field', () => {
    expect(sut.customerName).toBeDefined();
    expect(sut.customerName).toEqual(props.customerName);
    expect(typeof sut.customerName).toBe('string');
  });

  it('Getter of userId field', () => {
    expect(sut.userId).toBeDefined();
    expect(sut.userId).toEqual(props.userId);
    expect(typeof sut.userId).toBe('string');
  });

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });
});
