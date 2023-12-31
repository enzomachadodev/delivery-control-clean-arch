import { AddressEntity, AddressProps } from '../../address.entity';
import { AddressDataBuilder } from '@/adresses/domain/testing/helpers/address-data-builder';

describe('AddressEntity unit tests', () => {
  let props: AddressProps;
  let sut: AddressEntity;
  beforeEach(() => {
    AddressEntity.validate = jest.fn();
    props = AddressDataBuilder({});
    sut = new AddressEntity(props);
  });
  it('Constructor method', () => {
    expect(AddressEntity.validate).toHaveBeenCalled();
    expect(sut.props.orderId).toEqual(props.orderId);
    expect(sut.props.street).toEqual(props.street);
    expect(sut.props.number).toEqual(props.number);
    expect(sut.props.complement).toEqual(props.complement);
    expect(sut.props.neighborhood).toEqual(props.neighborhood);
    expect(sut.props.city).toEqual(props.city);
    expect(sut.props.state).toEqual(props.state);
    expect(sut.props.zipCode).toEqual(props.zipCode);
  });

  it('Getter of orderId field', () => {
    expect(sut.orderId).toBeDefined();
    expect(sut.orderId).toEqual(props.orderId);
    expect(typeof sut.orderId).toBe('string');
  });

  it('Getter of street field', () => {
    expect(sut.street).toBeDefined();
    expect(sut.street).toEqual(props.street);
    expect(typeof sut.street).toBe('string');
  });

  it('Getter of number field', () => {
    expect(sut.number).toBeDefined();
    expect(sut.number).toEqual(props.number);
    expect(typeof sut.number).toBe('number');
  });

  it('Getter of complement field', () => {
    expect(sut.complement).toBeDefined();
    expect(sut.complement).toEqual(props.complement);
    // Complement pode ser uma string ou null, então testamos se é uma string ou null
    expect(typeof sut.complement === 'string' || sut.complement === null).toBe(
      true,
    );
  });

  it('Getter of neighborhood field', () => {
    expect(sut.neighborhood).toBeDefined();
    expect(sut.neighborhood).toEqual(props.neighborhood);
    expect(typeof sut.neighborhood).toBe('string');
  });

  it('Getter of city field', () => {
    expect(sut.city).toBeDefined();
    expect(sut.city).toEqual(props.city);
    expect(typeof sut.city).toBe('string');
  });

  it('Getter of state field', () => {
    expect(sut.state).toBeDefined();
    expect(sut.state).toEqual(props.state);
    expect(typeof sut.state).toBe('string');
  });

  it('Getter of zipCode field', () => {
    expect(sut.zipCode).toBeDefined();
    expect(sut.zipCode).toEqual(props.zipCode);
    expect(typeof sut.zipCode).toBe('string');
  });
});
