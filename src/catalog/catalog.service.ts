import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogEntity } from './catalog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  Catalog,
  GetCatalogDto,
  mapToCatalog,
  mapToCatalogMany,
} from './dto/get-catalog.dto';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import {
  DeleteCatalogDto,
  DeleteCatalogManyDto,
} from './dto/delete-catalog.dto';
import { LocaleEntity } from '../locale/locale.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LocaleEntity)
    private readonly localeRepository: Repository<LocaleEntity>,
    @InjectRepository(CatalogEntity)
    private readonly catalogRepository: Repository<CatalogEntity>,
  ) {}

  async getAllCatalogs(user_id: string): Promise<GetCatalogDto> {
    const catalogs = await this.catalogRepository
      .createQueryBuilder('catalog')
      .leftJoinAndSelect('catalog.user', 'user')
      .leftJoinAndSelect('catalog.locales', 'locales')
      .where('user.id = :userId', { userId: user_id })
      .getMany();

    return catalogs?.length
      ? mapToCatalogMany(catalogs)
      : { fashion: [], home: [], general: [] };
  }

  async addCatalog(catalog: CreateCatalogDto): Promise<Catalog> {
    const isExist = await this.catalogRepository
      .createQueryBuilder('catalog')
      .where('name = :catalogName', { catalogName: catalog.name })
      .getOne();

    if (isExist) {
      throw new NotFoundException('Catalog already exist');
    }
    if (catalog.is_primary) {
      const previousPrimary = await this.catalogRepository
        .createQueryBuilder('catalog')
        .leftJoinAndSelect('catalog.user', 'user')
        .where('user.id = :userId', { userId: catalog.user_id })
        .andWhere('catalog.is_primary = :isPrimary', { isPrimary: true })
        .getOne();

      if (previousPrimary) {
        previousPrimary.is_primary = false;
        await this.catalogRepository.update(previousPrimary.id, {
          is_primary: false,
        });
      }
    }

    const [languages, user] = await Promise.all([
      this.localeRepository
        .createQueryBuilder('locales')
        .leftJoinAndSelect('locales.catalog', 'catalog')
        .getMany(),
      this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId: catalog.user_id })
        .getOne(),
    ]);

    const updatedCatalog = {
      name: catalog.name,
      vertical: catalog.vertical,
      is_primary: catalog.is_primary,
      user: [user],
    };

    const createdCatalog = this.catalogRepository.create(updatedCatalog);

    createdCatalog.locales = languages;
    createdCatalog.user = [user];

    const savedCatalog = await this.catalogRepository.save(createdCatalog);
    return mapToCatalog(savedCatalog);
  }

  async updateCatalog(catalog: UpdateCatalogDto): Promise<Catalog> {
    const fieldsToUpdate: Partial<UpdateCatalogDto> = {
      name: catalog.name,
      vertical: catalog.vertical,
      is_primary: catalog.is_primary,
      locales_ids: catalog.locales_ids,
    };

    Object.keys(fieldsToUpdate).forEach(
      (v) => fieldsToUpdate[v] !== undefined && delete fieldsToUpdate[v],
    );

    const updatedResult = await this.catalogRepository.update(
      catalog.catalog_id,
      fieldsToUpdate,
    );

    if (!updatedResult.affected) {
      throw new NotFoundException(
        `Catalog with id ${catalog.catalog_id} not found`,
      );
    }

    const updatedCatalog = await this.catalogRepository.findOne({
      where: { id: catalog.catalog_id, user: { id: catalog.user_id } },
      relations: ['user', 'locale'],
    });
    return mapToCatalog(updatedCatalog);
  }

  async deleteCatalogById({
    catalog_id,
    user_id,
  }: DeleteCatalogDto): Promise<GetCatalogDto> {
    const deleteResult = await this.catalogRepository.delete(catalog_id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Catalog with id ${catalog_id} not found`);
    }
    return await this.getAllCatalogs(user_id);
  }

  async deleteBulkCatalogs({
    catalog_ids,
    user_id,
  }: DeleteCatalogManyDto): Promise<GetCatalogDto> {
    const isAllExist = await this.catalogRepository.find({
      where: { id: In(catalog_ids) },
    });
    if (isAllExist.length !== catalog_ids.length) {
      throw new NotFoundException(`Catalog with id ${catalog_ids} not found`);
    }
    await this.catalogRepository.delete(catalog_ids);
    return await this.getAllCatalogs(user_id);
  }
}
