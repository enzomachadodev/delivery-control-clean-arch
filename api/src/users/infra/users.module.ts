import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptHashProvider } from './providers/hash-provider/bcrypt-hash.provider';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { SigninUseCase } from '../app/usecases/signin.usecase';
import { GetUserUseCase } from '../app/usecases/get-user.usecase';
import { UpdateUserUseCase } from '../app/usecases/update-user.usecase';
import { UpdateUserPasswordUseCase } from '../app/usecases/update-user-password.usecase';
import { DeleteUserUseCase } from '../app/usecases/delete-user.usecase';

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
      provide: UpdateUserUseCase.UseCase,
      useFactory(userRepository: UserRepository) {
        return new UpdateUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase,
      useFactory(userRepository: UserRepository, hashProvider: HashProvider) {
        return new SigninUseCase.UseCase(userRepository, hashProvider);
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase,
      useFactory(userRepository: UserRepository) {
        return new GetUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase,
      useFactory(userRepository: UserRepository) {
        return new UpdateUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserPasswordUseCase.UseCase,
      useFactory(userRepository: UserRepository, hashProvider: HashProvider) {
        return new UpdateUserPasswordUseCase.UseCase(
          userRepository,
          hashProvider,
        );
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase,
      useFactory: (userRepository: UserRepository) => {
        return new DeleteUserUseCase.UseCase(userRepository);
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
