import { BadRequestError } from '@/shared/app/errors/bad-request-error';
import { HashProvider } from '@/shared/app/providers/hash-provider';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };

  export type Output = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };
  export class UseCase {
    constructor(
      private userRepository: UserRepository,
      private hashProvider: HashProvider,
    ) {}
    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input;

      if (!email || !name || !password)
        throw new BadRequestError('Input data not provided');

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity(
        Object.assign(input, { password: hashPassword }),
      );

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
