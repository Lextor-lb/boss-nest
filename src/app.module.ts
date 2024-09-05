import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductSizingsModule } from './product-sizings/product-sizings.module';
import { ProductFittingsModule } from './product-fittings/product-fittings.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { ProductBrandsModule } from './product-brands/product-brands.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductsModule } from './products/products.module';
import configuration from 'config/configuration';
import { MediaModule } from './media/media.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { FileValidatorPipe } from './shared/pipes/file-validator.pipe';
import { CustomersModule } from './customers/customers.module';
import { SpecialsModule } from './specials/specials.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { StockReportModule } from './stock-report/stock-report.module';
import { VoucherReportModule } from './voucher-report/voucher-report.module';
import { BrandReportModule } from './brand-report/brand-report.module';
import { CategoryReportModule } from './category-report/category-report.module';
import { TypeReportModule } from './type-report/type-report.module';
import { SizingReportModule } from './sizing-report/sizing-report.module';
import { FittingReportModule } from './fitting-report/fitting-report.module';
import { EcommerceCategoriesModule } from './ecommerce-categories/ecommerce-categories.module';
import { EcommerceProductsModule } from './ecommerce-products/ecommerce-products.module';
import { CouponModule } from './coupon/coupon.module';
// import { OrderModule } from './order/order.module';
import { FirebaseModule } from './firebase/firebase.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { EcommerceUsersModule } from './ecommerce-users/ecommerce-users.module';
import { SlidersModule } from './sliders/sliders.module';
import { AddressModule } from './address/address.module';
import { MinioModule } from './minio/minio.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Adjust the root path to match the intended directory
      serveRoot: '/uploads', // This will serve files at http://localhost:3000/uploads/
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductSizingsModule,
    ProductFittingsModule,
    ProductTypesModule,
    ProductBrandsModule,
    ProductCategoriesModule,
    ProductsModule,
    MediaModule,
    ProductVariantsModule,
    CustomersModule,
    SpecialsModule,
    VouchersModule,
    StockReportModule,
    VoucherReportModule,
    BrandReportModule,
    CategoryReportModule,
    TypeReportModule,
    SizingReportModule,
    FittingReportModule,
    EcommerceCategoriesModule,
    EcommerceProductsModule,
    CouponModule,
    OrderModule,
    FirebaseModule,
    WishlistModule,
    EcommerceUsersModule,
    SlidersModule,
    AddressModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService, FileValidatorPipe],
})
export class AppModule {}
