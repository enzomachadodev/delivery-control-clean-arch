import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { BadRequestError } from '@/shared/app/errors/bad-request-error';

export namespace UpdateUserUseCase {
  export type Input = {
    id: string;
    name?: string;
    email?: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository) {}

    async execute(input: Input): Promise<Output> {
      const { id, ...rest } = input;
      if (!id) {
        throw new BadRequestError('Id not provided');
      }
      const entity = await this.userRepository.findById(input.id);
      entity.update(rest);
      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
