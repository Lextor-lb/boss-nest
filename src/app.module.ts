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

@Module({
  imports: [PrismaModule, ArticlesModule, UsersModule, AuthModule, ProductSizingsModule, ProductFittingsModule, ProductTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
