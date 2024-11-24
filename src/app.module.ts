import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { LocaleModule } from './locale/locale.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { config } from './typeorm.config';

@Module({
  imports: [
    CatalogModule,
    LocaleModule,
    UserModule,
    TypeOrmModule.forRoot(config),
  ],
})
export class AppModule {}
