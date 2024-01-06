import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';

export namespace ListUsersUseCase {
  export type Input = null;

  export type Output = UserOutput[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository) {}
    execute(): Promise<Output> {
      return this.userRepository.findAll();
    }
  }
}
