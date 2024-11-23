export interface DeleteCatalogDto {
  user_id: string;
  catalog_id: string;
}

export interface DeleteCatalogManyDto {
  user_id: string;
  catalog_ids: string[];
}
