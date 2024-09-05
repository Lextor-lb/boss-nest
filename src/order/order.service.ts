import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { MediaEntity } from 'src/media';
import { AddressService } from 'src/address/address.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly addressService: AddressService,
    private readonly vouchersService: VouchersService,
  ) {}
  whereCheckingNullClause: Prisma.OrderWhereInput = {
    isArchived: null,
  };

  async create({ orderRecords, addressId, ...orderData }: CreateOrderDto) {
    const order = await this.prisma.$transaction(
      async (transactionClient: PrismaClient) => {
        const address = await this.addressService.findOne(
          addressId,
          orderData.ecommerceUserId,
        );
        if (!address) {
          throw new BadRequestException('Address not found');
        }

        const addressJson = JSON.stringify({
          city: address.city,
          township: address.township,
          street: address.street,
          company: address.company || null,
          addressDetail: address.addressDetail,
        });

        // Create the order
        const order = await transactionClient.order.create({
          data: {
            ...orderData,
            address: addressJson,
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

        // Return the created order
        return order;
      },
    );

    // Fetch the created order with detailed information
    const detailedOrder = await this.findOne(order.id);
    return {
      status: true,
      message: 'Order Created Successfully!',
      data: detailedOrder,
    };
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

  async findAll(options: SearchOption): Promise<any> {
    const {
      page,
      limit,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    const total = await this.prisma.order.count({
      where: {
        ...this.whereCheckingNullClause,
      },
    });

    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    const orders = await this.prisma.order.findMany({
      where: {
        ...this.whereCheckingNullClause,
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

  async findOne(id: number): Promise<any> {
    const { orderRecords, ...order } = await this.prisma.order.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
      select: {
        id: true,
        orderCode: true,
        orderStatus: true,
        cancelReason: true,
        remark: true,
        total: true,
        address: true,
        createdAt: true,
        couponName: true,
        discount: true,
        ecommerceUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        orderRecords: {
          select: {
            salePrice: true,
            productVariant: {
              select: {
                id: true,
                colorCode: true,
                media: { select: { url: true } },
                product: {
                  select: {
                    name: true,
                    gender: true,
                    productCode: true,
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

    try {
      return new OrderDetailEntity({
        ...order,
        orderRecords: orderRecords.map((or) => ({
          id: or.productVariant.id,
          productName: or.productVariant.product.name,
          image: new MediaEntity({ url: or.productVariant.media.url }),
          productCode: or.productVariant.product.productCode,
          colorCode: or.productVariant.colorCode,
          gender: or.productVariant.product.gender,
          typeName: or.productVariant.product.productType.name,
          categoryName: or.productVariant.product.productCategory.name,
          fittingName: or.productVariant.product.productFitting.name,
          sizingName: or.productVariant.productSizing.name,
          price: or.salePrice,
        })),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    // Fetch the existing order with orderRecords
    const order = await this.prisma.order.findUnique({
      where: { id, AND: this.whereCheckingNullClause },
      select: {
        subTotal: true,
        total: true,
        discount: true,
        ecommerceUserId: true,
        orderRecords: { select: { productVariantId: true, salePrice: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (updateOrderDto.orderStatus === 'CANCELED') {
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

      await this.prisma.order.update({
        where: { id },
        data: {
          orderStatus: OrderStatus.CANCELED,
          cancelReason: updateOrderDto.cancelReason,
        },
      });

      return { status: true, message: 'Updated Successfully!' };
    }

    if (updateOrderDto.orderStatus === 'CONFIRMED') {
      const customer = await this.prisma.ecommerceUser.findUnique({
        where: { id: order.ecommerceUserId },
      });
      // Prepare voucher records
      const voucherRecords: voucherRecordDto[] = order.orderRecords.map(
        (record) => ({
          productVariantId: record.productVariantId,
          salePrice: record.salePrice,
          cost: record.salePrice,
          discount: 0, // Assuming no discount data is provided; adjust as needed
          discountByValue: 0,
        }),
      );

      // Create a voucher object
      const voucher: CreateVoucherDto = {
        voucherCode: updateOrderDto.voucherCode,
        type: 'ONLINE',
        paymentMethod: 'CASH',
        discount: order.discount ?? 0,
        discountByValue: 0,
        subTotal: order.subTotal,
        total: order.total,
        tax: 0,
        customerId: null,
        createdByUserId: updateOrderDto.createdByUserId,
        updatedByUserId: updateOrderDto.createdByUserId,
        quantity: order.orderRecords.length,
        remark: null,
        voucherRecords,
        customerName: customer.name,
        phoneNumber: customer.phone,
        promotionRate: 0,
      };

      await this.vouchersService.create(voucher);
      await this.prisma.order.update({
        where: { id },
        data: { orderStatus: OrderStatus.CONFIRMED },
      });

      return { status: true, message: 'Voucher Created Successfully!' };
    }

    // return updateOrderDto.orderStatus;

    await this.prisma.order.update({
      where: { id },
      data: { orderStatus: updateOrderDto.orderStatus },
    });
    return { status: true, message: 'Updated Successfully!' };
  }

  async findAllEcommerce(ecommerceUserId: number): Promise<any[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        ...this.whereCheckingNullClause,
        ecommerceUserId,
      },
      select: {
        id: true,
        cancelReason: true,
        remark: true,
        orderCode: true,
        orderStatus: true,
        total: true,
        address: true,
        createdAt: true,
        ecommerceUser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        orderRecords: {
          select: {
            salePrice: true,
            productVariant: {
              select: {
                id: true,
                colorCode: true,
                media: { select: { url: true } },
                product: {
                  select: {
                    name: true,
                    gender: true,
                    productCode: true,
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

    // Map through each order and return it in the desired format
    return orders.map((order) => {
      const { orderRecords, ...orderData } = order;

      return new OrderDetailEntity({
        ...orderData,
        orderRecords: orderRecords.map((or) => ({
          id: or.productVariant.id,
          productName: or.productVariant.product.name,
          image: new MediaEntity({ url: or.productVariant.media.url }),
          productCode: or.productVariant.product.productCode,
          colorCode: or.productVariant.colorCode,
          gender: or.productVariant.product.gender,
          typeName: or.productVariant.product.productType.name,
          categoryName: or.productVariant.product.productCategory.name,
          fittingName: or.productVariant.product.productFitting.name,
          sizingName: or.productVariant.productSizing.name,
          price: or.salePrice,
        })),
      });
    });
  }

  async updateEcommerce(
    id: number,
    ecommerceUserId: number,
    updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
        ecommerceUserId,
      },
    });

    if (!order) {
      throw new NotFoundException(
        'Order not found or does not belong to this user.',
      );
    }

    if (order.orderStatus !== OrderStatus.ORDERED) {
      throw new BadRequestException(
        'Only orders with status "ORDERED" can be canceled.',
      );
    }

    await this.prisma.order.update({
      where: { id },
      data: {
        orderStatus: OrderStatus.CANCELED,
        cancelReason: updateOrderDto.cancelReason,
      },
    });
    return { status: true, message: 'Order Cancel Successfully!' };
  }
}
