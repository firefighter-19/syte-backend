import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCatalogDto {
  @IsNotEmpty({
    message: 'User id is required',
  })
  @IsString({
    message: 'Catalog id must be a string',
  })
  user_id: string;
  @IsNotEmpty({
    message: 'Catalog id is required',
  })
  @IsString({
    message: 'Catalog id must be a string',
  })
  catalog_id: string;
  name?: string;
  vertical?: 'fashion' | 'home' | 'general';
  is_primary?: boolean;
  locales_ids?: string[];
}
