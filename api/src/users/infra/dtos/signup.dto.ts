import { SignupUseCase } from '@/users/app/usecases/signup.usecase';

export class SignupDto implements SignupUseCase.Input {
  name: string;
  email: string;
  password: string;
}
