import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { StatusDataBuilder } from '@/status/domain/testing/helpers/status-data-builder';
import { StatusEntity, StatusProps } from '../../status.entity';
describe('StatusEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a order with invalid name', () => {
      let props: StatusProps = {
        ...StatusDataBuilder({}),
        name: null,
      };

      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        name: '' as any,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        name: 10 as any,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        name: 'a' as any,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a order with invalid orderId', () => {
      let props: StatusProps = {
        ...StatusDataBuilder({}),
        orderId: null,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        orderId: '',
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        orderId: 10 as any,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        orderId: 'a',
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props: StatusProps = {
        ...StatusDataBuilder({}),
        createdAt: '2023' as any,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);

      props = {
        ...StatusDataBuilder({}),
        createdAt: 10 as any,
      };
      expect(() => new StatusEntity(props)).toThrow(EntityValidationError);
    });

    it('Should a valid status', () => {
      expect.assertions(0);

      const props: StatusProps = {
        ...StatusDataBuilder({}),
      };
      new StatusEntity(props);
    });
  });
});
