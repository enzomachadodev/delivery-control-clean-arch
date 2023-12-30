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

  it('Valid case for order rules', () => {
    const isValid = sut.validate(props);
    console.log(props);
    console.log(sut.errors);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new OrderRules(props));
  });
});
