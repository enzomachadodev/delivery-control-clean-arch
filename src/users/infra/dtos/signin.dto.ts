import { SigninUseCase } from '@/users/app/usecases/signin.usecase';

export class SigninDto implements SigninUseCase.Input {
  email: string;
  password: string;
}
