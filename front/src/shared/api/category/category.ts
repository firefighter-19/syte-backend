import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CatalogResponse } from "./catalog.response";
import { CatalogCreateRequest, CatalogUpdateRequest } from "./catalog.request";

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
    createCatalog: builder.mutation<CatalogResponse, CatalogCreateRequest>({
      query: (variables) => ({
        url: "catalog/create",
        method: "POST",
        body: variables,
      }),
    }),
    updateCatalog: builder.mutation<CatalogResponse, CatalogUpdateRequest>({
      query: (variables) => ({
        url: "catalog/update",
        method: "PATCH",
        body: variables,
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

export const {
  useCatalogQuery,
  useDeleteCatalogMutation,
  useCreateCatalogMutation,
  useUpdateCatalogMutation,
} = catalogsApi;
