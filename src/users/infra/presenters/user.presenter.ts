import { UserOutput } from '@/users/app/dtos/user-output';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UserPresenter {
  @ApiProperty({ description: 'User identification' })
  id: string;

  @ApiProperty({ description: 'Username' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User creation date' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({ description: 'Last user update' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;

  constructor(output: UserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}
