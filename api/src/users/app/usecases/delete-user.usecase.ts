import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';

export namespace DeleteUserUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository) {}

    async execute(input: Input): Promise<Output> {
      await this.userRepository.delete(input.id);
    }
  }
}
