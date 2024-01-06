import { UpdateUserUseCase } from '@/users/app/usecases/update-user.usecase';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  name?: string;
  email?: string;
}
