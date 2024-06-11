import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductSizingsModule } from './product-sizings/product-sizings.module';
import { ProductFittingsModule } from './product-fittings/product-fittings.module';
import { ProductTypesModule } from './product-types/product-types.module';
import { ProductBrandsModule } from './product-brands/product-brands.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';

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
    ArticlesModule,
    UsersModule,
    AuthModule,
    ProductSizingsModule,
    ProductFittingsModule,
    ProductTypesModule,
    ProductBrandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
