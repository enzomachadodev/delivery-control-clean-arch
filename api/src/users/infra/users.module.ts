import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../app/usecases/signup.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptHashProvider } from './providers/hash-provider/bcrypt-hash.provider';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { UserRepository } from '../domain/repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptHashProvider,
    },
    {
      provide: 'UserRepository',
      useFactory(userRepository: UserRepository, hashProvider: HashProvider) {
        return new SignupUseCase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
  ],
})
export class UsersModule {}
