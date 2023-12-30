import { BadRequestError } from '@/shared/app/errors/bad-request-error';
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
    constructor(private userRepository: UserRepository) {}
    async execute(input: Input): Promise<Output> {
      const { email, name, password } = input;

      if (!email || !name || !password)
        throw new BadRequestError('Input data not provided');

      await this.userRepository.emailExists(email);

      const entity = new UserEntity(input);

      await this.userRepository.insert(entity);

      return entity.toJSON();
    }
  }
}
