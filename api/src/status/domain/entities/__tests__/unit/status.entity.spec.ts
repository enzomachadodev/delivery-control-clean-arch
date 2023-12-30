import { StatusDataBuilder } from '@/status/domain/testing/helpers/status-data-builder';
import { StatusEntity, StatusProps } from '../../status.entity';

describe('StatusEntity unit tests', () => {
  let props: StatusProps;
  let sut: StatusEntity;
  beforeEach(() => {
    StatusEntity.validate = jest.fn();
    props = StatusDataBuilder({});
    sut = new StatusEntity(props);
  });
  it('Constructor method', () => {
    expect(StatusEntity.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.orderId).toEqual(props.orderId);
    expect(sut.props.createdAt).toEqual(expect.any(Date));
  });

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
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
