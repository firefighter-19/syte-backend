import { Controller, Get } from '@nestjs/common';
import { LocaleService } from './locale.service';

@Controller('locale')
export class LocaleController {
  constructor(private readonly localeService: LocaleService) {}

  @Get('/languages')
  getLanguages() {
    return this.localeService.getLanguages();
  }
}
