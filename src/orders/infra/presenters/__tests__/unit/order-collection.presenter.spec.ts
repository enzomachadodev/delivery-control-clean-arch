import { PaginationPresenter } from '@/shared/infra/presenters/pagination.presenter';
import { instanceToPlain } from 'class-transformer';
import { OrderCollectionPresenter } from '../../order-collection.presenter';
import { OrderPresenter } from '../../order.presenter';
import { randomUUID } from 'crypto';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';

describe('OrderCollectionPresenter unit tests', () => {
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

  describe('constructor', () => {
    it('should set values', () => {
      const sut = new OrderCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      expect(sut.meta).toBeInstanceOf(PaginationPresenter);
      expect(sut.meta).toStrictEqual(
        new PaginationPresenter({
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        }),
      );
      expect(sut.data).toStrictEqual([new OrderPresenter(props)]);
    });
  });

  it('should presenter data', () => {
    let sut = new OrderCollectionPresenter({
      items: [props],
      currentPage: 1,
      perPage: 2,
      lastPage: 1,
      total: 1,
    });
    let output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
          userId: props.userId,
          customerName: 'John Doe',
          currentStatus: OrderStatus.CONFIRMED,
          street: 'Street test',
          number: 1234,
          complement: 'Complement test',
          neighborhood: 'Neighborhood test',
          city: 'City test',
          state: 'State test',
          zipCode: '36570260',
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    });

    sut = new OrderCollectionPresenter({
      items: [props],
      currentPage: '1' as any,
      perPage: '2' as any,
      lastPage: '1' as any,
      total: '1' as any,
    });
    output = instanceToPlain(sut);
    expect(output).toStrictEqual({
      data: [
        {
          id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
          userId: props.userId,
          customerName: 'John Doe',
          currentStatus: OrderStatus.CONFIRMED,
          street: 'Street test',
          number: 1234,
          complement: 'Complement test',
          neighborhood: 'Neighborhood test',
          city: 'City test',
          state: 'State test',
          zipCode: '36570260',
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
        },
      ],
      meta: {
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      },
    });
  });
});
