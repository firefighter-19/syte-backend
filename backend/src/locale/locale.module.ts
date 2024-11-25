import { Module } from '@nestjs/common';
import { LocaleController } from './locale.controller';
import { LocaleService } from './locale.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleEntity } from './locale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocaleEntity])],
  controllers: [LocaleController],
  providers: [LocaleService],
})
export class LocaleModule {}
