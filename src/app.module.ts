import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleModule } from './locale/locale.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CatalogModule,
    LocaleModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'test',
      password: 'test',
      database: 'testDB',
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
