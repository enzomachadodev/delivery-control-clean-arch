import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';
import {
  StatusHistoryEntity,
  StatusHistoryProps,
} from '../../status-history.entity';
describe('StatusHistoryEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a order with invalid status', () => {
      let props: StatusHistoryProps = {
        ...StatusHistoryDataBuilder({}),
        status: null,
      };

      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        status: '' as any,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        status: 10 as any,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        status: 'a' as any,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );
    });

    it('Should throw an error when creating a order with invalid orderId', () => {
      let props: StatusHistoryProps = {
        ...StatusHistoryDataBuilder({}),
        orderId: null,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        orderId: '',
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        orderId: 10 as any,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        orderId: 'a',
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );
    });

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props: StatusHistoryProps = {
        ...StatusHistoryDataBuilder({}),
        createdAt: '2023' as any,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );

      props = {
        ...StatusHistoryDataBuilder({}),
        createdAt: 10 as any,
      };
      expect(() => new StatusHistoryEntity(props)).toThrow(
        EntityValidationError,
      );
    });

    it('Should a valid status', () => {
      expect.assertions(0);

      const props: StatusHistoryProps = {
        ...StatusHistoryDataBuilder({}),
      };
      new StatusHistoryEntity(props);
    });
  });
});
