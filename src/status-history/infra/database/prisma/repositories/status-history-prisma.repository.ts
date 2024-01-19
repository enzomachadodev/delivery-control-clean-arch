import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import {
  OrderStatus,
  StatusHistoryEntity,
} from '@/status-history/domain/entities/status-history.entity';
import { StatusHistoryRepository } from '@/status-history/domain/repositories/status-history.repository';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { StatusHistoryModelMapper } from '../models/status-history-model.mapper';

export class StatusHistoryPrismaRepository implements StatusHistoryRepository {
  constructor(private prismaService: PrismaService) {}

  async findByOrderId(orderId: string): Promise<StatusHistoryEntity[]> {
    const models = await this.prismaService.statusHistory.findMany({
      where: { orderId },
    });
    return models.map((model) => StatusHistoryModelMapper.toEntity(model));
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    await this.prismaService.statusHistory.deleteMany({
      where: {
        orderId,
      },
    });
  }

  async insert(entity: StatusHistoryEntity): Promise<void> {
    await this.prismaService.statusHistory.create({
      data: {
        ...entity.toJSON(),
        status: OrderStatus[entity.status] as PrismaOrderStatus,
      },
    });
  }
}
