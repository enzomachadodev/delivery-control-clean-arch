import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
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
    expect(sut.props.userId).toEqual(props.userId);
    expect(sut.props.customerName).toEqual(props.customerName);
    expect(sut.props.street).toEqual(props.street);
    expect(sut.props.number).toEqual(props.number);
    expect(sut.props.complement).toEqual(props.complement);
    expect(sut.props.neighborhood).toEqual(props.neighborhood);
    expect(sut.props.city).toEqual(props.city);
    expect(sut.props.state).toEqual(props.state);
    expect(sut.props.zipCode).toEqual(props.zipCode);
    expect(sut.props.currentStatus).toEqual(props.currentStatus);
    expect(sut.props.createdAt).toEqual(expect.any(Date));
    expect(sut.props.createdAt).toEqual(expect.any(Date));
  });

  it('Getter of userId field', () => {
    expect(sut.userId).toBeDefined();
    expect(sut.userId).toEqual(props.userId);
    expect(typeof sut.userId).toBe('string');
  });

  it('Getter of customerName field', () => {
    expect(sut.customerName).toBeDefined();
    expect(sut.customerName).toEqual(props.customerName);
    expect(typeof sut.customerName).toBe('string');
  });

  it('Getter of street field', () => {
    expect(sut.street).toBeDefined();
    expect(sut.street).toEqual(props.street);
    expect(typeof sut.street).toBe('string');
  });

  it('Getter of number field', () => {
    expect(sut.number).toBeDefined();
    expect(sut.number).toEqual(props.number);
    expect(typeof sut.number).toBe('number');
  });

  it('Getter of complement field', () => {
    expect(sut.complement).toBeDefined();
    expect(sut.complement).toEqual(props.complement);
    expect(typeof sut.complement === 'string' || sut.complement === null).toBe(
      true,
    );
  });

  it('Getter of neighborhood field', () => {
    expect(sut.neighborhood).toBeDefined();
    expect(sut.neighborhood).toEqual(props.neighborhood);
    expect(typeof sut.neighborhood).toBe('string');
  });

  it('Getter of city field', () => {
    expect(sut.city).toBeDefined();
    expect(sut.city).toEqual(props.city);
    expect(typeof sut.city).toBe('string');
  });

  it('Getter of state field', () => {
    expect(sut.state).toBeDefined();
    expect(sut.state).toEqual(props.state);
    expect(typeof sut.state).toBe('string');
  });

  it('Getter of zipCode field', () => {
    expect(sut.zipCode).toBeDefined();
    expect(sut.zipCode).toEqual(props.zipCode);
    expect(typeof sut.zipCode).toBe('string');
  });

  it('Getter of currentStatus field', () => {
    expect(sut.currentStatus).toBeDefined();
    expect(sut.currentStatus).toEqual(props.currentStatus);
    expect(typeof sut.currentStatus).toBe('number');
  });

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('Getter of updatedAt field', () => {
    expect(sut.updatedAt).toBeDefined();
    expect(sut.updatedAt).toBeInstanceOf(Date);
  });

  it('Should update currentStatus', () => {
    expect(OrderEntity.validate).toHaveBeenCalled();
    sut.updateStatus(OrderStatus.DISPATCHED);
    expect(sut.props.currentStatus).toEqual(OrderStatus.DISPATCHED);
  });
});
