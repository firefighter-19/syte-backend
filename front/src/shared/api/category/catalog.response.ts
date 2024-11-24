export interface CatalogResponse {
  fashion: Vertical[];
  home: Vertical[];
  general: Vertical[];
}

export interface Vertical {
  id: string;
  name: string;
  vertical: string;
  is_primary: boolean;
  indexed_at: Date;
  locales: Locale[];
}

export interface Locale {
  id: string;
  language: string;
  code: string;
}
