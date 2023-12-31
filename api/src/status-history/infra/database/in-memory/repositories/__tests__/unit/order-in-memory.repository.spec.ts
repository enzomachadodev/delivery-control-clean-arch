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
});
