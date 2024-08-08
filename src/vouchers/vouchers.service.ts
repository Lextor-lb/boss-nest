import { Prisma, PrismaClient } from '@prisma/client';
import { CreateVoucherDto, voucherRecordDto } from './dto/create-voucher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { VoucherEntity } from './entities/voucher.entity';
import { VoucherRecordEntity } from './entities/voucherRecord.entity';
import { CustomerEntity } from 'src/customers';
import { SpecialEntity } from 'src/specials';
import { BarcodeEntity } from './entities/barcode.entity';

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}
  whereCheckingNullClause: Prisma.ProductVariantWhereInput = {
    isArchived: null,
    statusStock: null,
  };

  whereVoucherCheckingNullClause: Prisma.VoucherWhereInput = {
    isArchived: null,
  };

  async indexAll(
    filter?: Prisma.VoucherFindManyArgs,
  ): Promise<VoucherEntity[]> {
    const vouchers = await this.prisma.voucher.findMany({
      ...filter,
      where: {
        ...this.whereVoucherCheckingNullClause,
        ...(filter?.where || {}),
      },
    });

    return vouchers.map((voucher) => new VoucherEntity(voucher));
  }

  async find(params: Prisma.VoucherFindManyArgs) {
    const vouchers = await this.prisma.voucher.findMany(params);
    return vouchers.map((voucher) => new VoucherEntity(voucher));
  }

  async barcode(barcode: string): Promise<BarcodeEntity> {
    try {
      const productVariant = await this.getProductVariant(barcode);
      return this.mapToBarcodeEntity(productVariant);
    } catch (error) {
      throw new NotFoundException('Barcode not found!');
    }
  }

  private async getProductVariant(barcode: string) {
    return await this.prisma.productVariant.findUnique({
      where: {
        barcode,
        AND: this.whereCheckingNullClause,
      },
      select: {
        id: true,
        barcode: true,
        productSizing: { select: { name: true } },
        product: {
          select: {
            name: true,
            gender: true,
            productCode: true,
            salePrice: true,
            productBrand: { select: { name: true } },
            productType: { select: { name: true } },
            productCategory: { select: { name: true } },
            productFitting: { select: { name: true } },
          },
        },
      },
    });
  }

  private mapToBarcodeEntity(productVariant: any): BarcodeEntity {
    const {
      id,
      barcode,
      productSizing: { name: productSizing },
      product: {
        name: productName,
        gender,
        salePrice: price,
        productBrand: { name: productBrand },
        productType: { name: productType },
        productCategory: { name: productCategory },
        productFitting: { name: productFitting },
      },
    } = productVariant;

    return new BarcodeEntity({
      id,
      barcode,
      productName,
      gender,
      productBrand,
      productType,
      productCategory,
      productFitting,
      productSizing,
      price,
    });
  }

  async create({ voucherRecords, ...voucherData }: CreateVoucherDto) {
    return this.prisma.$transaction(async (transactionClient: PrismaClient) => {
      try {
        const voucher = await this.createVoucher(
          transactionClient,
          voucherData,
          voucherRecords,
        );

        await this.createVoucherRecords(
          transactionClient,
          voucher.id,
          voucherRecords,
        );

        const createdVoucher = await transactionClient.voucher.findUnique({
          where: { id: voucher.id },
          include: {
            voucherRecords: true,
            customer: {
              select: {
                id: true,
                name: true,
                special: true,
                phoneNumber: true,
                gender: true,
                address: true,
                remark: true,
                isArchived: true,
                ageRange: true,
                dateOfBirth: true,
                specialId: true,
                createdByUserId: true,
                updatedByUserId: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        });

        if (!createdVoucher) {
          throw new Error('Failed to fetch created voucher');
        }

        const { voucherRecords: vr, customer, ...restVoucher } = createdVoucher;
        const promotionRate = customer?.special?.promotionRate ?? null;

        // Create CustomerEntity with the full customer object
        const customerEntity = new CustomerEntity({
          ...customer,
          special: promotionRate
            ? new SpecialEntity({ promotionRate })
            : undefined,
        });

        const voucherEntity = new VoucherEntity({
          ...restVoucher,
          customer: customerEntity,
          special: promotionRate
            ? new SpecialEntity({ promotionRate })
            : undefined,
          voucherRecords: vr.map((vRecord) => new VoucherRecordEntity(vRecord)),
        });

        return {
          status: true,
          message: 'Created Successfully!',
          data: voucherEntity,
        };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create Voucher');
      }
    });
  }

  private async createVoucher(
    transactionClient: PrismaClient,
    voucherData: Omit<CreateVoucherDto, 'voucherRecords'>,
    voucherRecords: voucherRecordDto[],
  ) {
    return transactionClient.voucher.create({
      data: {
        ...voucherData,
        quantity: voucherRecords.length,
      },
    });
  }

  private async createVoucherRecords(
    transactionClient: PrismaClient,
    voucherId: number,
    voucherRecords: voucherRecordDto[],
  ) {
    for (const record of voucherRecords) {
      await this.createVoucherRecord(transactionClient, voucherId, record);
    }
  }

  private async createVoucherRecord(
    transactionClient: PrismaClient,
    voucherId: number,
    record: voucherRecordDto,
  ) {
    const { productVariantId, salePrice, ...recordData } = record;

    const productDetails = await this.getProductDetails(
      transactionClient,
      productVariantId,
    );
    const productJson = this.formatProductDetails(productDetails, salePrice);

    await transactionClient.voucherRecord.create({
      data: {
        ...recordData,
        product: productJson,
        voucher: { connect: { id: voucherId } },
        productVariant: { connect: { id: productVariantId } },
      },
    });

    await this.updateProductVariantStatus(transactionClient, productVariantId);
  }

  private async getProductDetails(
    transactionClient: PrismaClient,
    productVariantId: number,
  ) {
    return transactionClient.productVariant.findUnique({
      where: { id: productVariantId },
      select: {
        productSizing: { select: { name: true } },
        product: {
          select: {
            name: true,
            gender: true,
            stockPrice: true,
            productBrand: { select: { name: true } },
            productType: { select: { name: true } },
            productCategory: { select: { name: true } },
            productFitting: { select: { name: true } },
          },
        },
      },
    });
  }

  private formatProductDetails(productDetails: any, salePrice: number) {
    const { product, productSizing } = productDetails;
    return JSON.stringify({
      name: product.name,
      gender: product.gender,
      productBrand: product.productBrand.name,
      productType: product.productType.name,
      productCategory: product.productCategory.name,
      productFitting: product.productFitting.name,
      productSizing: productSizing.name,
      salePrice,
      stockPrice: product.stockPrice,
    });
  }

  private async updateProductVariantStatus(
    transactionClient: PrismaClient,
    productVariantId: number,
  ) {
    await transactionClient.productVariant.update({
      where: { id: productVariantId },
      data: { statusStock: 'SOLDOUT' },
    });
  }

  async findOne(id: number): Promise<VoucherEntity> {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
      include: {
        voucherRecords: true,
        customer: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            gender: true,
            address: true,
            remark: true,
            isArchived: true,
            ageRange: true,
            dateOfBirth: true,
            specialId: true,
            createdByUserId: true,
            updatedByUserId: true,
            createdAt: true,
            updatedAt: true,
            special: { select: { promotionRate: true } },
          },
        },
      },
    });

    const { voucherRecords, customer, ...restVoucher } = voucher;
    const promotionRate = customer?.special?.promotionRate ?? null;

    return new VoucherEntity({
      ...restVoucher,
      customer: customer
        ? new CustomerEntity({
            ...customer,
            special: promotionRate
              ? new SpecialEntity({ promotionRate })
              : undefined,
          })
        : undefined,
      special: promotionRate ? new SpecialEntity({ promotionRate }) : undefined,
      voucherRecords: voucherRecords.map((vr) => new VoucherRecordEntity(vr)),
    });
  }
}
