import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CatalogResponse } from "./catalog.response";

export const catalogsApi = createApi({
  reducerPath: "catalogsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    catalog: builder.query<CatalogResponse, { user_id: string }>({
      query: ({ user_id }) => ({
        url: "catalog/all/",
        method: "GET",
        params: { user_id },
      }),
    }),
    deleteCatalog: builder.mutation<
      CatalogResponse,
      { catalog_id: string; user_id: string }
    >({
      query: ({ catalog_id, user_id }) => ({
        url: "catalog/delete",
        method: "DELETE",
        params: { catalog_id, user_id },
      }),
    }),
  }),
});

export const { useCatalogQuery, useDeleteCatalogMutation } = catalogsApi;
