import { StatusProps } from '@/status/domain/entities/status.entity';
import {
  StatusRules,
  StatusValidator,
  StatusValidatorFactory,
} from '../../status.validator';
import { StatusDataBuilder } from '@/status/domain/testing/helpers/status-data-builder';

let sut: StatusValidator;
let props: StatusProps;

describe('StatusValidator unit tests', () => {
  beforeEach(() => {
    sut = StatusValidatorFactory.create();
    props = StatusDataBuilder({});
  });

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null as any);
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a StatusOption',
      'name must be a string',
    ]);

    isValid = sut.validate({ ...props, name: '' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a StatusOption',
    ]);

    isValid = sut.validate({ ...props, name: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name must be a StatusOption',
      'name must be a string',
    ]);

    isValid = sut.validate({ ...props, name: 'a' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual(['name must be a StatusOption']);
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
