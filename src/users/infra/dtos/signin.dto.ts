import { SigninUseCase } from '@/users/app/usecases/signin.usecase';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto implements SigninUseCase.Input {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
