import { BadRequestError } from '@/shared/app/errors/bad-request-error';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { UseCase as DefaultUseCase } from '@/shared/app/usecases/usecase';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { InvalidCredentialsError } from '@/shared/app/errors/invalid-credentials-error';

export namespace SigninUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { email, password } = input;

      if (!email || !password) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = await this.userRepository.findByEmail(email);

      const hashPasswordMatches = await this.hashProvider.compareHash(
        password,
        entity.password,
      );

      if (!hashPasswordMatches) {
        throw new InvalidCredentialsError('Invalid credentials');
      }

      return UserOutputMapper.toOutput(entity);
    }
  }
}
