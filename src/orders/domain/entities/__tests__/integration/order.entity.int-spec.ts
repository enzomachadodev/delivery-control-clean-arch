import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { OrderEntity, OrderProps } from '../../order.entity';
import { OrderDataBuilder } from '@/orders/domain/testing/helpers/order-data-builder';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

describe('OrderEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a order with invalid userId', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        userId: null,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        userId: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        userId: 10 as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        userId: 'a',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a order with invalid customerName', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        customerName: null,
      };

      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        customerName: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        customerName: 10 as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        customerName: 'a'.repeat(256),
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a order with invalid street', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        street: null,
      };

      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        street: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        street: 10 as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        street: 'a'.repeat(256),
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid number', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        number: 'invalid' as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        number: 0,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        number: -1,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid complement', () => {
      const props: OrderProps = {
        ...OrderDataBuilder({}),
        complement: 'a'.repeat(256),
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid neighborhood', () => {
      const props: OrderProps = {
        ...OrderDataBuilder({}),
        neighborhood: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid city', () => {
      const props: OrderProps = {
        ...OrderDataBuilder({}),
        city: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid state', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        state: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        state: 'ABC',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid zipCode', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        zipCode: '',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        zipCode: '12345',
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating an order with invalid currentStatus', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        currentStatus: '' as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        currentStatus: '12345' as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a user with invalid createdAt', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        createdAt: '2023' as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        createdAt: 10 as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when creating a user with invalid updatedAt', () => {
      let props: OrderProps = {
        ...OrderDataBuilder({}),
        updatedAt: '2023' as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);

      props = {
        ...OrderDataBuilder({}),
        updatedAt: 10 as any,
      };
      expect(() => new OrderEntity(props)).toThrow(EntityValidationError);
    });

    it('Should a valid order', () => {
      expect.assertions(0);

      const props: OrderProps = {
        ...OrderDataBuilder({}),
      };

      new OrderEntity(props);
    });
  });

  describe('Update status method', () => {
    it('Should throw an error when update status with invalid status', () => {
      const entity = new OrderEntity(OrderDataBuilder({}));
      expect(() => entity.updateStatus(null)).toThrow(EntityValidationError);
      expect(() => entity.updateStatus('' as any)).toThrow(
        EntityValidationError,
      );
      expect(() => entity.updateStatus(10 as any)).toThrow(
        EntityValidationError,
      );
      expect(() => entity.updateStatus('a' as any)).toThrow(
        EntityValidationError,
      );
    });

    it('Should a valid order', () => {
      expect.assertions(0);

      const props: OrderProps = {
        ...OrderDataBuilder({}),
      };

      const entity = new OrderEntity(props);
      entity.updateStatus(OrderStatus.DELIVERED);
    });
  });
});
