import { AddressProps } from '@/adresses/domain/entities/address.entity';
import {
  AddressRules,
  AddressValidator,
  AddressValidatorFactory,
} from '../../address.validator';
import { AddressDataBuilder } from '@/adresses/domain/testing/helpers/address-data-builder';

let sut: AddressValidator;
let props: AddressProps;

describe('AddressValidator unit tests', () => {
  beforeEach(() => {
    sut = AddressValidatorFactory.create();
    props = AddressDataBuilder({});
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

  it('Valid case for address rules', () => {
    const isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new AddressRules(props));
  });
});
