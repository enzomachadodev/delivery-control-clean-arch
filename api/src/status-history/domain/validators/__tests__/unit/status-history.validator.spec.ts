import { StatusHistoryProps } from '@/status-history/domain/entities/status-history.entity';
import {
  StatusRules,
  StatusHistoryValidator,
  StatusHistoryValidatorFactory,
} from '../../status-history.validator';
import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';

let sut: StatusHistoryValidator;
let props: StatusHistoryProps;

describe('StatusHistoryValidator unit tests', () => {
  beforeEach(() => {
    sut = StatusHistoryValidatorFactory.create();
    props = StatusHistoryDataBuilder({});
  });

  it('Invalidation cases for status field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors['status']).toStrictEqual([
      'status should not be empty',
      'status must be a OrderStatus',
    ]);

    isValid = sut.validate({ ...props, status: '' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['status']).toStrictEqual([
      'status should not be empty',
      'status must be a OrderStatus',
    ]);

    isValid = sut.validate({ ...props, status: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['status']).toStrictEqual([
      'status must be a OrderStatus',
    ]);

    isValid = sut.validate({ ...props, status: 'a' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['status']).toStrictEqual([
      'status must be a OrderStatus',
    ]);
  });

  it('Invalidation cases for orderId field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors['orderId']).toStrictEqual([
      'orderId should not be empty',
      'orderId must be a UUID',
      'orderId must be a string',
    ]);

    isValid = sut.validate({ ...props, orderId: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['orderId']).toStrictEqual([
      'orderId should not be empty',
      'orderId must be a UUID',
    ]);

    isValid = sut.validate({ ...props, orderId: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['orderId']).toStrictEqual([
      'orderId must be a UUID',
      'orderId must be a string',
    ]);

    isValid = sut.validate({ ...props, orderId: 'a'.repeat(38) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['orderId']).toStrictEqual(['orderId must be a UUID']);
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

  it('Valid case for status rules', () => {
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new StatusRules(props));
  });
});
