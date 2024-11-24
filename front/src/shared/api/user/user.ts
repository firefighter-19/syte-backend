import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserResponse } from "./user.response";

export const userApi = createApi({
  reducerPath: "userApi",
  tagTypes: ["User"],
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    createUser: builder.mutation<UserResponse, { user: string }>({
      query: (user) => ({
        url: "user/create",
        method: "POST",
        body: { user },
      }),
    }),
  }),
});

export const { useCreateUserMutation } = userApi;
