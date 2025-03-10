import { DictionaryApiResponse } from "@/src/app/dictionary/interfaces";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const dictionaryApi = createApi({
  reducerPath: "dictionaryApi",
  refetchOnFocus: true, // when the window is refocused, refetch the data
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.dictionaryapi.dev/api/v2/entries/en/",
  }),
  endpoints: (builder) => ({
    getWord: builder.query<DictionaryApiResponse[], { word: string }>({
      query: ({ word }) => `${word}`,
    }),
  }),
});

export const { useGetWordQuery } = dictionaryApi;