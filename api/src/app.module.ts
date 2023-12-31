import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infra/env-config/env-config.module';
import { UsersModule } from './users/infra/users.module';
import { OrdersModule } from './orders/infra/orders.module';

@Module({
  imports: [EnvConfigModule, UsersModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
