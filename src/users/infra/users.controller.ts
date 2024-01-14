import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  Put,
} from '@nestjs/common';
import { SignupDto, UpdateUserDto, UpdateUserPasswordDto } from './dtos';
import { SignupUseCase } from '../app/usecases/signup.usecase';
import { DeleteUserUseCase } from '../app/usecases/delete-user.usecase';
import { GetUserUseCase } from '../app/usecases/get-user.usecase';
import { SigninUseCase } from '../app/usecases/signin.usecase';
import { UpdateUserPasswordUseCase } from '../app/usecases/update-user-password.usecase';
import { UpdateUserUseCase } from '../app/usecases/update-user.usecase';
import { SigninDto } from './dtos/signin.dto';
import { UserOutput } from '../app/dtos/user-output';
import { UserPresenter } from './presenters/user.presenter';
import { AuthService } from '@/auth/infra/auth.service';

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase;

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase;

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase;

  @Inject(UpdateUserPasswordUseCase.UseCase)
  private updateUserPasswordUseCase: UpdateUserPasswordUseCase.UseCase;

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase;

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output);
  }

  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    const output = await this.signinUseCase.execute(signinDto);
    return this.authService.generateJwt(output.id);
  }

  @Get('me')
  async profile(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({ id });
    return UsersController.userToResponse(output);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({
      id,
      ...updateUserDto,
    });
    return UsersController.userToResponse(output);
  }

  @Patch('password/:id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    const output = await this.updateUserPasswordUseCase.execute({
      id,
      ...updateUserPasswordDto,
    });
    return UsersController.userToResponse(output);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deleteUserUseCase.execute({ id });
  }
}
