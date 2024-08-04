import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus, Prisma, PrismaClient } from '@prisma/client';
import { VouchersService } from 'src/vouchers/vouchers.service';
import {
  CreateVoucherDto,
  voucherRecordDto,
} from 'src/vouchers/dto/create-voucher.dto';
import { SearchOption } from 'src/shared/types/searchOption';
import { OrderEntity } from './entities/order.entity';
import { OrderDetailEntity } from './entities/orderDetail.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vouchersService: VouchersService,
  ) {}
  whereCheckingNullClause: Prisma.OrderWhereInput = {
    isArchived: null,
  };

  async create({ orderRecords, ...orderData }: CreateOrderDto) {
    return this.prisma.$transaction(async (transactionClient: PrismaClient) => {
      try {
        // Create the order
        const order = await transactionClient.order.create({
          data: {
            ...orderData,
          },
        });

        // Update product variant status for each order record
        if (orderRecords && orderRecords.length > 0) {
          // Extract product variant IDs from orderRecords
          const productVariantIds = orderRecords.map(
            (record) => record.productVariantId,
          );

          // Update product variant status
          await Promise.all(
            productVariantIds.map((productVariantId) =>
              this.updateProductVariantStatus(
                transactionClient,
                productVariantId,
              ),
            ),
          );

          // Create order records
          await Promise.all(
            orderRecords.map((record) =>
              transactionClient.orderRecord.create({
                data: {
                  ...record,
                  orderId: order.id, // Link to the created order
                },
              }),
            ),
          );
        }

        return { status: true, message: 'Order Created Successfully!' };
      } catch (error) {
        throw new Error('Failed to create Order: ' + error.message);
      }
    });
  }

  private async updateProductVariantStatus(
    transactionClient: PrismaClient,
    productVariantId: number,
  ) {
    await transactionClient.productVariant.update({
      where: { id: productVariantId },
      data: { statusStock: 'ORDERED' },
    });
  }

  async findAll(options: SearchOption, ecommerceUserId: number): Promise<any> {
    const {
      page,
      limit,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    const total = await this.prisma.order.count({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId,
      },
    });

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const orders = await this.prisma.order.findMany({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId,
      },
      include: { ecommerceUser: { select: { name: true, email: true } } },
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });

    return {
      data: orders.map((order) => {
        const { ecommerceUser, ...orderData } = order;
        return new OrderEntity({
          ...orderData,
          customerName: ecommerceUser.name,
          customerEmail: ecommerceUser.email,
        });
      }),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: number, ecommerceUserId: number): Promise<any> {
    const { orderRecords, ...order } = await this.prisma.order.findUnique({
      where: { id, AND: this.whereCheckingNullClause, ecommerceUserId },
      select: {
        id: true,
        orderId: true,
        createdAt: true,
        orderRecords: {
          select: {
            salePrice: true,
            productVariant: {
              select: {
                id: true,
                colorCode: true,
                product: {
                  select: {
                    name: true,
                    gender: true,
                    productType: { select: { name: true } },
                    productCategory: { select: { name: true } },
                    productFitting: { select: { name: true } },
                  },
                },
                productSizing: { select: { name: true } },
              },
            },
          },
        },
      },
    });
    return new OrderDetailEntity({
      ...order,
      orderRecords: orderRecords.map((or) => ({
        id: or.productVariant.id,
        productName: or.productVariant.product.name,
        colorCode: or.productVariant.colorCode,
        gender: or.productVariant.product.gender,
        typeName: or.productVariant.product.productType.name,
        categoryName: or.productVariant.product.productCategory.name,
        fittingName: or.productVariant.product.productFitting.name,
        sizingName: or.productVariant.productSizing.name,
        price: or.salePrice,
      })),
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // Fetch the existing order with orderRecords
    const order = await this.prisma.order.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
      select: {
        subTotal: true,
        total: true,
        orderRecords: { select: { productVariantId: true, salePrice: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (updateOrderDto.orderStatus === 'CANCEL') {
      // Archive the order
      await this.prisma.order.update({
        where: { id },
        data: { isArchived: new Date() },
      });

      // Fetch all related OrderRecords for the order
      const orderRecords = await this.prisma.orderRecord.findMany({
        where: { orderId: id },
        select: { productVariantId: true },
      });

      // Update statusStock to null for each related ProductVariant
      await Promise.all(
        orderRecords.map((record) =>
          this.prisma.productVariant.update({
            where: { id: record.productVariantId },
            data: { statusStock: null },
          }),
        ),
      );

      return { status: true, message: 'Updated Successfully!' };
    }

    if (updateOrderDto.orderStatus === 'CONFIRM') {
      // Prepare voucher records
      const voucherRecords: voucherRecordDto[] = order.orderRecords.map(
        (record) => ({
          productVariantId: record.productVariantId,
          salePrice: record.salePrice,
          cost: record.salePrice,
          discount: 0, // Assuming no discount data is provided; adjust as needed
        }),
      );

      // Create a voucher object
      const voucher: CreateVoucherDto = {
        voucherCode: updateOrderDto.voucherCode,
        type: 'ONLINE',
        paymentMethod: 'CASH',
        discount: updateOrderDto.discount ?? 0,
        subTotal: order.subTotal,
        total: order.total,
        tax: 0,
        customerId: null,
        createdByUserId: updateOrderDto.createdByUserId,
        updatedByUserId: updateOrderDto.createdByUserId,
        quantity: order.orderRecords.length,
        remark: null,
        voucherRecords,
      };

      await this.vouchersService.create(voucher);
      await this.prisma.order.update({
        where: { id },
        data: { orderStatus: OrderStatus.CONFIRM },
      });

      return { status: true, message: 'Voucher Created Successfully!' };
    }

    await this.prisma.order.update({
      where: { id },
      data: { orderStatus: updateOrderDto.orderStatus },
    });
    return { status: true, message: 'Updated Successfully!' };
  }
}
