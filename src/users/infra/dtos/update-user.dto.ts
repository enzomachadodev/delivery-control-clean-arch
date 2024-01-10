import { UpdateUserUseCase } from '@/users/app/usecases/update-user.usecase';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
