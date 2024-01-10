import { UpdateUserPasswordUseCase } from '@/users/app/usecases/update-user-password.usecase';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto
  implements Omit<UpdateUserPasswordUseCase.Input, 'id'>
{
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
