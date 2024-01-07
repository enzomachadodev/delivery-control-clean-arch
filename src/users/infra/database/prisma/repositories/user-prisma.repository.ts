import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserModelMapper } from '../models/user-model.mapper';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class UserPrismaRepository implements UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      return UserModelMapper.toEntity(user);
    } catch {
      throw new NotFoundError(`UserModel not found using email ${email}`);
    }
  }
  async emailExists(email: string): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      throw new ConflictError(`Email address already used`);
    }
  }
  async insert(entity: UserEntity): Promise<void> {
    await this.prismaService.user.create({
      data: entity.toJSON(),
    });
  }
  async findById(id: string): Promise<UserEntity> {
    return this._get(id);
  }
  async findAll(): Promise<UserEntity[]> {
    const models = await this.prismaService.user.findMany();
    return models.map((model) => UserModelMapper.toEntity(model));
  }
  async update(entity: UserEntity): Promise<void> {
    await this._get(entity._id);
    await this.prismaService.user.update({
      data: entity.toJSON(),
      where: {
        id: entity._id,
      },
    });
  }
  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.user.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<UserEntity> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });
      return UserModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`UserModel not found using ID: ${id}`);
    }
  }
}
