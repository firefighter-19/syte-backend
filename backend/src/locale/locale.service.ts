import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocaleEntity } from './locale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocaleService {
  constructor(
    @InjectRepository(LocaleEntity)
    private readonly localeRepository: Repository<LocaleEntity>,
  ) {}
  async getLanguages() {
    return await this.localeRepository.createQueryBuilder('locale').getMany();
  }
}
