import { DatabaseModule } from '@/shared/infra/database/database.module';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ListUsersUseCase } from '../../list-users.usecase';

describe('ListUsersUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new ListUsersUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should returns all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const model = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute();

    expect(output).toStrictEqual([model]);
  });
});
