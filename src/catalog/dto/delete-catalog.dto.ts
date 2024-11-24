import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DeleteCatalogDto {
  @IsNotEmpty({
    message: 'User id is required',
  })
  @IsString({
    message: 'User id must be a string',
  })
  user_id: string;

  @IsNotEmpty({
    message: 'Catalog id is required',
  })
  @IsString({
    message: 'User id must be a string',
  })
  catalog_id: string;
}

export class DeleteCatalogManyDto {
  @IsNotEmpty({
    message: 'User id is required',
  })
  @IsString({
    message: 'User id must be a string',
  })
  user_id: string;
  @IsArray({
    message: 'Catalog ids must be an array',
  })
  @IsNotEmpty({
    message: 'Catalog id is required',
  })
  catalog_ids: string[];
}
