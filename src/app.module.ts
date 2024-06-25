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
  ],
  controllers: [AppController],
  providers: [AppService, FileValidatorPipe],
})
export class AppModule {}
