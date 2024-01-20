import { UpdateUserUseCase } from '@/users/app/usecases/update-user.usecase';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
