import { Injectable, NotFoundException } from '@nestjs/common';
import { CatalogEntity } from './catalog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      .withDeleted()
      .where('name = :catalogName', { catalogName: catalog.name })
      .getOne();

    if (isExist || isExist?.deleted_at === null) {
      throw new NotFoundException('Catalog already exist');
    }
    if (catalog.is_primary) {
      this.changePreviousVerticalPrimary(this.catalogRepository, catalog);
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

    const createdCatalog = isExist?.deleted_at
      ? isExist
      : this.catalogRepository.create(updatedCatalog);

    if (isExist?.deleted_at) {
      createdCatalog.deleted_at = null;
    }

    const languagesExist = languages.filter((locale) =>
      catalog.locales_ids.includes(locale.id),
    );

    if (!languagesExist.length) {
      throw new NotFoundException(
        `Languages with ids ${catalog.locales_ids.join(', ')} not found`,
      );
    }

    createdCatalog.locales = languagesExist;
    createdCatalog.user = [user];

    const savedCatalog = await this.catalogRepository.save(createdCatalog);
    return mapToCatalog(savedCatalog);
  }

  async updateCatalog(catalog: UpdateCatalogDto): Promise<Catalog> {
    const languages = await this.localeRepository
      .createQueryBuilder('locales')
      .getMany();

    const languagesExist = languages.filter((locale) =>
      catalog.locales_ids.includes(locale.id),
    );

    if (!languagesExist.length) {
      throw new NotFoundException(
        `Languages with ids ${catalog.locales_ids.join(', ')} not found`,
      );
    }

    const fieldsToUpdate = {
      name: catalog.name,
      is_primary: catalog.is_primary,
      locales: languagesExist,
    };

    Object.keys(fieldsToUpdate).forEach(
      (v) => fieldsToUpdate[v] == undefined && delete fieldsToUpdate[v],
    );
    if (!Object.keys(fieldsToUpdate).length) {
      throw new NotFoundException('Nothing to update');
    }

    if (catalog.is_primary) {
      this.changePreviousVerticalPrimary(this.catalogRepository, catalog);
    }

    const existingCatalog = await this.catalogRepository.findOne({
      where: { id: catalog.catalog_id },
      relations: ['user', 'locales'],
    });

    const value = await this.catalogRepository.save({
      ...existingCatalog,
      ...fieldsToUpdate,
    });

    return mapToCatalog(value);

    // const updatedCatalog = await this.catalogRepository.findOne({
    //   where: { id: catalog.catalog_id, user: { id: catalog.user_id } },
    //   relations: ['user', 'locale'],
    // });
    // return mapToCatalog(updatedCatalog);
  }

  async deleteCatalogById({
    catalog_id,
    user_id,
  }: DeleteCatalogDto): Promise<GetCatalogDto> {
    const isUserExist = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: user_id })
      .getOne();

    if (!isUserExist) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }

    const deleteCatalogResult = await this.catalogRepository
      .createQueryBuilder('catalog')
      .softDelete()
      .where('catalog.id = :catalogId', { catalogId: catalog_id })
      .execute();

    if (!deleteCatalogResult.affected) {
      throw new NotFoundException(`Catalog with id ${catalog_id} not found`);
    }

    return await this.getAllCatalogs(user_id);
  }

  async deleteBulkCatalogs({
    catalog_ids,
    user_id,
  }: DeleteCatalogManyDto): Promise<GetCatalogDto> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['catalog'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${user_id} not found`);
    }

    const existingCatalogIds = await this.catalogRepository
      .createQueryBuilder('catalog')
      .where('catalog.id IN (:...catalogIds)', { catalogIds: catalog_ids })
      .select(['catalog.id'])
      .getMany();

    const foundIds = existingCatalogIds.map((catalog) => catalog.id);
    const missingIds = catalog_ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      throw new NotFoundException(
        `Catalogs with ids ${missingIds.join(', ')} not found`,
      );
    }

    user.catalog = user.catalog.filter(
      (catalog) => !catalog_ids.includes(catalog.id),
    );

    if (user.catalog.length) {
      await this.updateCatalog({
        user_id: user.id,
        catalog_id: user.catalog[0].id,
        is_primary: true,
      });
    }

    catalog_ids.forEach(async (id) => {
      await this.catalogRepository.softDelete(id);
    });

    await this.userRepository.save(user);

    return await this.getAllCatalogs(user_id);
  }

  private async changePreviousVerticalPrimary(
    catalogRepository: Repository<CatalogEntity>,
    catalog: Partial<UpdateCatalogDto>,
  ): Promise<void> {
    const previousPrimary = await catalogRepository
      .createQueryBuilder('catalog')
      .leftJoinAndSelect('catalog.user', 'user')
      .where('user.id = :userId', { userId: catalog.user_id })
      .andWhere('catalog.is_primary = :isPrimary', { isPrimary: true })
      .getOne();

    if (previousPrimary) {
      previousPrimary.is_primary = false;
      await catalogRepository.update(previousPrimary.id, {
        is_primary: false,
      });
    }
  }
}
