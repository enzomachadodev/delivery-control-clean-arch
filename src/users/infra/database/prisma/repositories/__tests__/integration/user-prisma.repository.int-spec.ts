import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infra/database/prisma/testing/setup-prisma-tests';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { DatabaseModule } from '@/shared/infra/database/database.module';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  //eslint-disable-next-line
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID: FakeId'),
    );
  });

  it('should finds a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newUser.id);
    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });

    expect(result).toStrictEqual(entity.toJSON());
  });

  it('should returns all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const entities = await sut.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    entities.map((item) =>
      expect(item.toJSON()).toStrictEqual(entity.toJSON()),
    );
  });

  it('should throws error on update when a entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID: ${entity._id}`),
    );
  });

  it('should update a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    entity.update({ name: 'new name' });
    await sut.update(entity);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output.name).toBe('new name');
  });

  it('should throws error on delete when a entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() => sut.delete(entity._id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID: ${entity._id}`),
    );
  });

  it('should delete a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    await sut.delete(entity._id);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output).toBeNull();
  });

  it('should throws error when a entity not found', async () => {
    await expect(() => sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError(`UserModel not found using email a@a.com`),
    );
  });

  it('should finds a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    const output = await sut.findByEmail('a@a.com');

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throws error when a entity found by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() => sut.emailExists('a@a.com')).rejects.toThrow(
      new ConflictError(`Email address already used`),
    );
  });

  it('should not finds a entity by email', async () => {
    expect.assertions(0);
    await sut.emailExists('a@a.com');
  });
});
