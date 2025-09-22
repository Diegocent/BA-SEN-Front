// Archivo base para definir el api slice de RTK Query
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = import.meta.env.VITE_URL || "http://localhost:8000/api/";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder: any) => ({
    resumenGeneral: builder.query({
      query: (params: any) => ({
        url: "resumen-general/",
        params,
      }),
    }),
    asistenciaDetallada: builder.query({
      query: (params: any) => ({
        url: "detallada/",
        params,
      }),
    }),
  }),
});

export const { useResumenGeneralQuery, useAsistenciaDetalladaQuery } = api;
