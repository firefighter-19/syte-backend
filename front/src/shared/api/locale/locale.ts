import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocaleResponse } from "./locale.response";

export const localeApi = createApi({
  reducerPath: "localeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    languages: builder.query<LocaleResponse[], void>({
      query: () => ({
        url: "locale/languages",
        method: "GET",
      }),
    }),
  }),
});

export const { useLanguagesQuery } = localeApi;
