import { DatabaseModule } from '@/shared/infra/database/database.module';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { BcryptHashProvider } from '@/users/infra/providers/hash-provider/bcrypt-hash.provider';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { SigninUseCase } from '../../signin.usecase';
import { InvalidCredentialsError } from '@/shared/app/errors/invalid-credentials-error';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';

describe('SigninUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: SigninUseCase.UseCase;
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
    sut = new SigninUseCase.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should not be able to authenticate with wrong email', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() =>
      sut.execute({
        email: entity.email,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    );
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: 'fake',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should throws error when email not provided', async () => {
    await expect(() =>
      sut.execute({
        email: null,
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should throws error when password not provided', async () => {
    await expect(() =>
      sut.execute({
        email: 'a@a.com',
        password: null,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should authenticate a user', async () => {
    const hashPassword = await hashProvider.generateHash('1234');
    const entity = new UserEntity(
      UserDataBuilder({ email: 'a@a.com', password: hashPassword }),
    );
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      email: 'a@a.com',
      password: '1234',
    });

    expect(output).toMatchObject(entity.toJSON());
  });
});
