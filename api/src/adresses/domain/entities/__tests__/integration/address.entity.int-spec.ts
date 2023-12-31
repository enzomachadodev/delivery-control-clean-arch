import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { AddressEntity, AddressProps } from '../../address.entity';
import { AddressDataBuilder } from '@/adresses/domain/testing/helpers/address-data-builder';

describe('AddressEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a order with invalid orderId', () => {
      let props: AddressProps = {
        ...AddressDataBuilder({}),
        orderId: null,
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        orderId: '',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        orderId: 10 as any,
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        orderId: 'a',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a order with invalid street', () => {
      let props: AddressProps = {
        ...AddressDataBuilder({}),
        street: null,
      };

      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        street: '',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        street: 10 as any,
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        street: 'a'.repeat(256),
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an address with invalid number', () => {
      let props: AddressProps = {
        ...AddressDataBuilder({}),
        number: 'invalid' as any,
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        number: 0,
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        number: -1,
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an address with invalid complement', () => {
      const props: AddressProps = {
        ...AddressDataBuilder({}),
        complement: 'a'.repeat(256),
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an address with invalid neighborhood', () => {
      const props: AddressProps = {
        ...AddressDataBuilder({}),
        neighborhood: '',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an address with invalid city', () => {
      const props: AddressProps = {
        ...AddressDataBuilder({}),
        city: '',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an address with invalid state', () => {
      let props: AddressProps = {
        ...AddressDataBuilder({}),
        state: '',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        state: 'ABC',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an address with invalid zipCode', () => {
      let props: AddressProps = {
        ...AddressDataBuilder({}),
        zipCode: '',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);

      props = {
        ...AddressDataBuilder({}),
        zipCode: '12345',
      };
      expect(() => new AddressEntity(props)).toThrow(EntityValidationError);
    });

    it('Should a valid address', () => {
      expect.assertions(0);

      const props: AddressProps = {
        ...AddressDataBuilder({}),
      };
      new AddressEntity(props);
    });
  });
});
