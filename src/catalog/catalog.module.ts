import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/user.entity';
import { LocaleEntity } from 'src/locale/locale.entity';
import { CatalogEntity } from './catalog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, LocaleEntity, CatalogEntity]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}
