export interface CatalogCreateRequest {
  user_id: string;
  name: string;
  vertical: string;
  is_primary: boolean;
  locales_ids: string[];
}

export type CatalogUpdateRequest = CatalogCreateRequest & {
  catalog_id: string;
};
