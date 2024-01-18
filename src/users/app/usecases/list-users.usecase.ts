import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { UserEntity } from '@/users/domain/entities/user.entity';

export namespace ListUsersUseCase {
  export type Input = null;

  export type Output = UserOutput[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository) {}
    async execute(): Promise<Output> {
      const result = await this.userRepository.findAll();
      return this.toOutput(result);
    }

    private toOutput(result: UserEntity[]): Output {
      return result.map((item) => UserOutputMapper.toOutput(item));
    }
  }
}
