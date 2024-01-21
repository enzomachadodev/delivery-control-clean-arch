import { UpdateUserUseCase } from '@/users/app/usecases/update-user.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @ApiPropertyOptional({ description: 'Username' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'User email' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
}
