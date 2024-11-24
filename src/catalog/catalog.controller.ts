import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import {
  DeleteCatalogDto,
  DeleteCatalogManyDto,
} from './dto/delete-catalog.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('/all')
  getAllCatalog(@Query() { user_id }: { user_id: string }) {
    return this.catalogService.getAllCatalogs(user_id);
  }

  @Post('/create')
  addCatalog(@Body() catalog: CreateCatalogDto) {
    return this.catalogService.addCatalog(catalog);
  }

  @Patch('/update')
  updateCatalogById(@Body() catalog: UpdateCatalogDto) {
    return this.catalogService.updateCatalog(catalog);
  }

  @Delete('/delete')
  deleteCatalogById(@Query() variables: DeleteCatalogDto) {
    return this.catalogService.deleteCatalogById(variables);
  }

  @Delete('/bulk')
  deleteBulkCatalogs(@Body() variables: DeleteCatalogManyDto) {
    return this.catalogService.deleteBulkCatalogs(variables);
  }
}
