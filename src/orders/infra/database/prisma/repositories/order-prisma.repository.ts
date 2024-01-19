import { PrismaService } from '@/shared/infra/database/prisma/prisma.service';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { OrderRepository } from '@/orders/domain/repositories/order.repository';
import { OrderModelMapper } from '../models/order-model.mapper';
import { OrderEntity } from '@/orders/domain/entities/order.entity';
import { OrderStatus } from '@/status-history/domain/entities/status-history.entity';
import { OrderStatus as PrismaOrderStatus } from '@prisma/client';

export class OrderPrismaRepository implements OrderRepository.Repository {
  sortableFields: string[] = ['customerName', 'createdAt'];
  constructor(private prismaService: PrismaService) {}

  async findByUserId(
    userId: string,
    params: OrderRepository.SearchParams,
  ): Promise<OrderRepository.SearchResult> {
    const sortable = this.sortableFields.includes(params.sort) || false;
    const orderByField = sortable ? params.sort : 'createdAt';
    const orderByDir = sortable ? params.sortDir : 'desc';

    const count = await this.prismaService.order.count({
      where: {
        userId,
        ...(params.filter && {
          customerName: {
            contains: params.filter,
            mode: 'insensitive',
          },
        }),
      },
    });

    const models = await this.prismaService.order.findMany({
      where: {
        userId,
        ...(params.filter && {
          customerName: {
            contains: params.filter,
            mode: 'insensitive',
          },
        }),
      },
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip:
        params.page && params.page > 0 ? (params.page - 1) * params.perPage : 1,
      take: params.perPage && params.perPage > 0 ? params.perPage : 15,
    });

    return new OrderRepository.SearchResult({
      items: models.map((model) => OrderModelMapper.toEntity(model)),
      currentPage: params.page,
      perPage: params.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: params.filter,
      total: count,
    });
  }

  async search(
    props: OrderRepository.SearchParams,
  ): Promise<OrderRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'createdAt';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.order.count({
      ...(props.filter && {
        where: {
          customerName: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.order.findMany({
      ...(props.filter && {
        where: {
          customerName: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new OrderRepository.SearchResult({
      items: models.map((model) => OrderModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    });
  }

  async insert(entity: OrderEntity): Promise<void> {
    await this.prismaService.order.create({
      data: {
        ...entity.toJSON(),
        currentStatus: OrderStatus[entity.currentStatus] as PrismaOrderStatus,
      },
    });
  }

  findById(id: string): Promise<OrderEntity> {
    return this._get(id);
  }

  async findAll(): Promise<OrderEntity[]> {
    const models = await this.prismaService.order.findMany();
    return models.map((model) => OrderModelMapper.toEntity(model));
  }

  async update(entity: OrderEntity): Promise<void> {
    await this._get(entity._id);
    await this.prismaService.order.update({
      data: {
        ...entity.toJSON(),
        currentStatus: OrderStatus[entity.currentStatus] as PrismaOrderStatus,
      },
      where: {
        id: entity._id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this._get(id);
    await this.prismaService.order.delete({
      where: { id },
    });
  }

  protected async _get(id: string): Promise<OrderEntity> {
    try {
      const user = await this.prismaService.order.findUnique({
        where: { id },
      });
      return OrderModelMapper.toEntity(user);
    } catch (error) {
      throw new NotFoundError(`OrderModel not found using ID: ${id}`);
    }
  }
}
