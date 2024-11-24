import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCatalogDto {
  @IsNotEmpty({
    message: 'User id is required',
  })
  @IsString({
    message: 'User id must be a string',
  })
  user_id: string;

  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsString({
    message: 'Name must be a string',
  })
  name: string;
  @IsEnum(['fashion', 'home', 'general'], {
    message: 'Vertical must be one of: fashion, home, or general',
  })
  vertical: 'fashion' | 'home' | 'general';

  @IsNotEmpty()
  @IsBoolean()
  is_primary: boolean;

  @IsNotEmpty({
    message: 'Locales ID or IDs required',
  })
  locales_ids: string[];
}
