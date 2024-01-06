import { OrderProps } from '@/orders/domain/entities/order.entity';
import {
  OrderRules,
  OrderValidator,
  OrderValidatorFactory,
} from '../../order.validator';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';

let sut: OrderValidator;
let props: OrderProps;

describe('OrderValidator unit tests', () => {
  beforeEach(() => {
    sut = OrderValidatorFactory.create();
    props = OrderDataBuilder({});
  });

  it('Invalidation cases for userId field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors['userId']).toStrictEqual([
      'userId should not be empty',
      'userId must be a UUID',
      'userId must be a string',
    ]);

    isValid = sut.validate({ ...props, userId: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['userId']).toStrictEqual([
      'userId should not be empty',
      'userId must be a UUID',
    ]);

    isValid = sut.validate({ ...props, userId: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['userId']).toStrictEqual([
      'userId must be a UUID',
      'userId must be a string',
    ]);

    isValid = sut.validate({ ...props, userId: 'a'.repeat(38) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['userId']).toStrictEqual(['userId must be a UUID']);
  });

  it('Invalidation cases for customerName field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors['customerName']).toStrictEqual([
      'customerName should not be empty',
      'customerName must be a string',
      'customerName must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, customerName: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['customerName']).toStrictEqual([
      'customerName should not be empty',
    ]);

    isValid = sut.validate({ ...props, customerName: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['customerName']).toStrictEqual([
      'customerName must be a string',
      'customerName must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, customerName: 'a'.repeat(256) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['customerName']).toStrictEqual([
      'customerName must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for street field', () => {
    let isValid = sut.validate({ ...props, street: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['street']).toStrictEqual(['street should not be empty']);

    isValid = sut.validate({ ...props, street: 'a'.repeat(256) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['street']).toStrictEqual([
      'street must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for number field', () => {
    let isValid = sut.validate({ ...props, number: 'invalid' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['number']).toStrictEqual([
      'number must be a positive number',
      'number must be an integer number',
      'number must be a number conforming to the specified constraints',
    ]);

    isValid = sut.validate({ ...props, number: 0 });
    expect(isValid).toBeFalsy();
    expect(sut.errors['number']).toStrictEqual([
      'number must be a positive number',
    ]);

    isValid = sut.validate({ ...props, number: -1 });
    expect(isValid).toBeFalsy();
    expect(sut.errors['number']).toStrictEqual([
      'number must be a positive number',
    ]);
  });

  it('Invalidation cases for complement field', () => {
    const isValid = sut.validate({ ...props, complement: 'a'.repeat(256) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['complement']).toStrictEqual([
      'complement must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for neighborhood field', () => {
    const isValid = sut.validate({ ...props, neighborhood: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['neighborhood']).toStrictEqual([
      'neighborhood should not be empty',
    ]);
  });

  it('Invalidation cases for city field', () => {
    const isValid = sut.validate({ ...props, city: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['city']).toStrictEqual(['city should not be empty']);
  });

  it('Invalidation cases for state field', () => {
    let isValid = sut.validate({ ...props, state: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['state']).toStrictEqual([
      'state must be exactly 2 characters',
      'state should not be empty',
    ]);

    isValid = sut.validate({ ...props, state: 'ABC' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['state']).toStrictEqual([
      'state must be exactly 2 characters',
    ]);
  });

  it('Invalidation cases for zipCode field', () => {
    let isValid = sut.validate({ ...props, zipCode: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['zipCode']).toStrictEqual([
      'zipCode should match the pattern XXXXX-XXX',
      'zipCode should not be empty',
    ]);

    isValid = sut.validate({ ...props, zipCode: '12345' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['zipCode']).toStrictEqual([
      'zipCode should match the pattern XXXXX-XXX',
    ]);
  });

  it('Invalidation cases for currentStatus field', () => {
    let isValid = sut.validate({ ...props, currentStatus: '' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['currentStatus']).toStrictEqual([
      'currentStatus must be a OrderStatus',
      'currentStatus should not be empty',
    ]);

    isValid = sut.validate({ ...props, currentStatus: '12345' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['currentStatus']).toStrictEqual([
      'currentStatus must be a OrderStatus',
    ]);
  });

  it('Invalidation cases for createdAt field', () => {
    let isValid = sut.validate({ ...props, createdAt: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ]);

    isValid = sut.validate({ ...props, createdAt: '2023' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['createdAt']).toStrictEqual([
      'createdAt must be a Date instance',
    ]);
  });

  it('Invalidation cases for updatedAt field', () => {
    let isValid = sut.validate({ ...props, updatedAt: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['updatedAt']).toStrictEqual([
      'updatedAt must be a Date instance',
    ]);

    isValid = sut.validate({ ...props, updatedAt: '2023' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['updatedAt']).toStrictEqual([
      'updatedAt must be a Date instance',
    ]);
  });

  it('Valid case for order rules', () => {
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new OrderRules(props));
  });
});
