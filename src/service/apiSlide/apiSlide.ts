import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProductResponse } from "@/types/product";

export const createApiSlide = createApi({
  reducerPath: "createApiSlide",
  baseQuery: fetchBaseQuery({ baseUrl: "https://dummyjson.com/" }),
  endpoints: (builder) => ({
    getProduct: builder.query<ProductResponse, void>({
      query: () => "/products",
    }),
  }),
});

export const { useGetProductQuery } = createApiSlide;
