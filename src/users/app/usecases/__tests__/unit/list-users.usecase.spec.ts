import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserInMemoryRepository } from '@/users/infra/database/in-memory/repositories/user-in-memory.repository';
import { ListUsersUseCase } from '../../list-users.usecase';

describe('ListUsersUseCase unit tests', () => {
  let sut: ListUsersUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new ListUsersUseCase.UseCase(repository);
  });

  it('should return the users ordered by createdAt', async () => {
    const user1 = new UserEntity(UserDataBuilder({}));
    const user2 = new UserEntity(UserDataBuilder({}));
    const items = [user1, user2];
    repository.items = items;
    const output = await sut.execute();
    expect(output).toHaveLength(2);
    expect(output[0]).toStrictEqual(user1.toJSON());
    expect(output[1]).toStrictEqual(user2.toJSON());
  });
});
