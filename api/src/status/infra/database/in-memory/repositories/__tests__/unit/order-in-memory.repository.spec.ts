import { StatusEntity } from '@/status/domain/entities/status.entity';
import { StatusInMemoryRepository } from '../../status-in-memory.repository';
import { StatusDataBuilder } from '@/status/domain/testing/helpers/status-data-builder';

describe('StatusInMemoryRepository unit tests', () => {
  let sut: StatusInMemoryRepository;

  beforeEach(() => {
    sut = new StatusInMemoryRepository();
  });

  it('Should list status by orderId - findByOrderId method', async () => {
    const entity = new StatusEntity(StatusDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByOrderId(entity.orderId);
    expect([entity]).toStrictEqual(result);
  });
});
