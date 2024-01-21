import { randomUUID } from 'crypto';
import { instanceToPlain } from 'class-transformer';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { OrderPresenter } from '../../order.presenter';

describe('OrderPresenter unit tests', () => {
  const date = new Date();
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    userId: randomUUID(),
    customerName: 'John Doe',
    currentStatus: OrderStatus.CONFIRMED,
    street: 'Street test',
    number: 1234,
    complement: 'Complement test',
    neighborhood: 'Neighborhood test',
    city: 'City test',
    state: 'State test',
    zipCode: '36570260',
    createdAt: date,
    updatedAt: date,
  };
  let sut: OrderPresenter;

  beforeEach(() => {
    sut = new OrderPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.userId).toEqual(props.userId);
      expect(sut.customerName).toEqual(props.customerName);
      expect(sut.currentStatus).toEqual(props.currentStatus);
      expect(sut.street).toEqual(props.street);
      expect(sut.number).toEqual(props.number);
      expect(sut.neighborhood).toEqual(props.neighborhood);
      expect(sut.complement).toEqual(props.complement);
      expect(sut.city).toEqual(props.city);
      expect(sut.state).toEqual(props.state);
      expect(sut.zipCode).toEqual(props.zipCode);
      expect(sut.createdAt).toEqual(props.createdAt);
      expect(sut.updatedAt).toEqual(props.updatedAt);
    });
  });

  it('should presenter data', () => {
    const output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      userId: props.userId,
      customerName: 'John Doe',
      currentStatus: props.currentStatus,
      street: 'Street test',
      number: 1234,
      complement: 'Complement test',
      neighborhood: 'Neighborhood test',
      city: 'City test',
      state: 'State test',
      zipCode: '36570260',
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    });
  });
});
