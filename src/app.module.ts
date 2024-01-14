import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { UsersModule } from './users/infra/users.module';
import { OrdersModule } from './orders/infra/orders.module';
import { DatabaseModule } from './shared/infra/database/database.module';
import { PrismaService } from './shared/infra/database/prisma/prisma.service';
import { AuthModule } from './auth/infra/auth.module';

@Module({
  imports: [
    EnvConfigModule,
    UsersModule,
    OrdersModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
