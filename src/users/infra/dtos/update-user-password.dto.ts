import { UpdateUserPasswordUseCase } from '@/users/app/usecases/update-user-password.usecase';

export class UpdateUserPasswordDto
  implements Omit<UpdateUserPasswordUseCase.Input, 'id'>
{
  password: string;
  oldPassword: string;
}
