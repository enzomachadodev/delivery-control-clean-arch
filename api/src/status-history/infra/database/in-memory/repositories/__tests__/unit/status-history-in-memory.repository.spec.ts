import { StatusHistoryEntity } from '@/status-history/domain/entities/status-history.entity';
import { StatusHistoryInMemoryRepository } from '../../status-history-in-memory.repository';
import { StatusHistoryDataBuilder } from '@/status-history/domain/testing/helpers/status-history-data-builder';

describe('StatusHistoryInMemoryRepository unit tests', () => {
  let sut: StatusHistoryInMemoryRepository;

  beforeEach(() => {
    sut = new StatusHistoryInMemoryRepository();
  });

  it('Should list status by orderId - findByOrderId method', async () => {
    const entity = new StatusHistoryEntity(StatusHistoryDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByOrderId(entity.orderId);
    expect([entity]).toStrictEqual(result);
  });

  it('Should delete status by orderId - deleteManyByOrderId method', async () => {
    const entity1 = new StatusHistoryEntity(StatusHistoryDataBuilder({}));
    const entity2 = new StatusHistoryEntity(StatusHistoryDataBuilder({}));
    await sut.insert(entity1);
    await sut.insert(entity1);
    await sut.insert(entity1);
    await sut.insert(entity2);
    await sut.deleteManyByOrderId(entity1.orderId);
    expect(sut.items).toStrictEqual([entity2]);
  });
});
