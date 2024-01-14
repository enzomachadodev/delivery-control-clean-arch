import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { OrderPrismaRepository } from './database/prisma/repositories/order-prisma.repository';
import { CreateOrderUseCase } from '../app/usecases/create-order.usecase';
import { UserPrismaRepository } from '@/users/infra/database/prisma/repositories/user-prisma.repository';
import { StatusHistoryPrismaRepository } from '@/status-history/infra/database/prisma/repositories/status-history-prisma.repository';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { OrderRepository } from '../domain/repositories/order.repository';
import { GetOrderUseCase } from '../app/usecases/get-order.usecase';
import { ListUserOrdersUseCase } from '../app/usecases/list-user-orders.usecase';
import { UpdateOrderStatusUseCase } from '../app/usecases/update-order-status.usecase';
import { DeleteOrderUseCase } from '../app/usecases/delete-order.usecase';
import { AuthModule } from '@/auth/infra/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'OrderRepository',
      useFactory(prismaService: PrismaService) {
        return new OrderPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'UserRepository',
      useFactory(prismaService: PrismaService) {
        return new UserPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'StatusHistoryRepository',
      useFactory(prismaService: PrismaService) {
        return new StatusHistoryPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateOrderUseCase.UseCase,
      useFactory(
        orderRepository: OrderRepository.Repository,
        userRepository: UserRepository,
        statusHistoryRepository: StatusHistoryRepository,
      ) {
        return new CreateOrderUseCase.UseCase(
          orderRepository,
          userRepository,
          statusHistoryRepository,
        );
      },
      inject: ['OrderRepository', 'UserRepository', 'StatusHistoryRepository'],
    },
    {
      provide: GetOrderUseCase.UseCase,
      useFactory(orderRepository: OrderRepository.Repository) {
        return new GetOrderUseCase.UseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
    {
      provide: ListUserOrdersUseCase.UseCase,
      useFactory(orderRepository: OrderRepository.Repository) {
        return new ListUserOrdersUseCase.UseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },

    {
      provide: UpdateOrderStatusUseCase.UseCase,
      useFactory(
        orderRepository: OrderRepository.Repository,
        statusHistoryRepository: StatusHistoryRepository,
      ) {
        return new UpdateOrderStatusUseCase.UseCase(
          orderRepository,
          statusHistoryRepository,
        );
      },
      inject: ['OrderRepository', 'StatusHistoryRepository'],
    },

    {
      provide: DeleteOrderUseCase.UseCase,
      useFactory(orderRepository: OrderRepository.Repository) {
        return new DeleteOrderUseCase.UseCase(orderRepository);
      },
      inject: ['OrderRepository'],
    },
  ],
})
export class OrdersModule {}
