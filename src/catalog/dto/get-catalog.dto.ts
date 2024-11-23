import { GetLocaleDto } from 'src/locale/dto/locale.dto';
import { CatalogEntity } from '../catalog.entity';

export type GetCatalogDto = {
  fashion: Catalog[];
  home: Catalog[];
  general: Catalog[];
};

export type Catalog = {
  id: string;
  name: string;
  vertical: 'fashion' | 'home' | 'general';
  is_primary: boolean;
  indexed_at: Date;
  locales: GetLocaleDto[];
};

export function mapToCatalogMany(catalog: CatalogEntity[]): GetCatalogDto {
  return catalog.reduce(
    (catalogs: GetCatalogDto, cur) => {
      if (catalogs[cur.vertical]) {
        const createdCatalog = mapToCatalog(cur);
        catalogs[cur.vertical].push(createdCatalog);
      }
      return catalogs;
    },
    { fashion: [], home: [], general: [] },
  );
}

export function mapToCatalog(catalog: CatalogEntity): Catalog {
  return {
    id: catalog.id,
    name: catalog.name,
    vertical: catalog.vertical,
    is_primary: catalog.is_primary,
    indexed_at: catalog.indexed_at,
    locales: catalog.locales.map((locale) => ({
      id: locale.id,
      language: locale.language,
      code: locale.code,
    })),
  };
}
