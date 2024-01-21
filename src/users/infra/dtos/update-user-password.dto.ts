import { UpdateUserPasswordUseCase } from '@/users/app/usecases/update-user-password.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto
  implements Omit<UpdateUserPasswordUseCase.Input, 'id'>
{
  @ApiProperty({ description: 'New user password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Old user password' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
