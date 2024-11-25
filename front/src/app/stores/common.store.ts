import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { catalogsApi } from "../../shared/api/category/category";
import { userApi } from "../../shared/api/user/user";
import { localeApi } from "../../shared/api/locale/locale";

export const store = configureStore({
  reducer: {
    [catalogsApi.reducerPath]: catalogsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      catalogsApi.middleware,
      userApi.middleware,
      localeApi.middleware,
    ),
});

setupListeners(store.dispatch);
