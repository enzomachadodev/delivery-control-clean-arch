import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';
import {
  StatusHistoryEntity,
  StatusHistoryProps,
} from '../../status-history.entity';

describe('StatusHistoryEntity unit tests', () => {
  let props: StatusHistoryProps;
  let sut: StatusHistoryEntity;
  beforeEach(() => {
    StatusHistoryEntity.validate = jest.fn();
    props = StatusHistoryDataBuilder({});
    sut = new StatusHistoryEntity(props);
  });
  it('Constructor method', () => {
    expect(StatusHistoryEntity.validate).toHaveBeenCalled();
    expect(sut.props.status).toEqual(props.status);
    expect(sut.props.orderId).toEqual(props.orderId);
    expect(sut.props.createdAt).toEqual(expect.any(Date));
  });

  it('Getter of status field', () => {
    expect(sut.status).toBeDefined();
    expect(sut.status).toEqual(props.status);
    expect(typeof sut.status).toBe('number');
  });

  it('Getter of orderId field', () => {
    expect(sut.orderId).toBeDefined();
    expect(sut.orderId).toEqual(props.orderId);
    expect(typeof sut.orderId).toBe('string');
  });

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });
});
