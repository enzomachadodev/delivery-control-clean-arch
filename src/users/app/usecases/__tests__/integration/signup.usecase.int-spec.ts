import { DatabaseModule } from '@/shared/infra/database/database.module';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { SignupUseCase } from '../../signup.usecase';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { BcryptHashProvider } from '@/users/infra/providers/hash-provider/bcrypt-hash.provider';

describe('SignupUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SignupUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptHashProvider();
  });

  beforeEach(async () => {
    sut = new SignupUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a user', async () => {
    const props = {
      name: 'test name',
      email: 'a@a.com',
      password: 'TestPassword123',
    };
    const output = await sut.execute(props);
    expect(output.id).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
