export interface UpdateCatalogDto {
  user_id: string;
  catalog_id: string;
  name?: string;
  vertical?: 'fashion' | 'home' | 'general';
  is_primary?: boolean;
  locales_ids?: string[];
}
