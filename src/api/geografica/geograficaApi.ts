import { api } from "../api";

export const geograficaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPorUbicacion: builder.query({
      query: (params) => ({
        url: "por-ubicacion/",
        params,
      }),
    }),
    getPorDepartamento: builder.query({
      query: (params) => ({
        url: "por-departamento/",
        params,
      }),
    }),
    eventosPorDepartamento: builder.query({
      query: (params) => ({
        url: "eventos-por-departamento/",
        params,
      }),
    }),
    eventosPorLocalidad: builder.query({
      query: (params) => ({
        url: "eventos-por-localidad/",
        params,
      }),
    }),
    resumenPorDepartamento: builder.query({
      query: (params) => ({
        url: "resumen-por-departamento/",
        params,
      }),
    }),
    incendiosAnualesPorDepartamento: builder.query({
      query: (params) => ({
        url: "incendios-anuales-por-departamento/",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPorUbicacionQuery,
  useGetPorDepartamentoQuery,
  useEventosPorDepartamentoQuery,
  useEventosPorLocalidadQuery,
  useResumenPorDepartamentoQuery,
  useIncendiosAnualesPorDepartamentoQuery,
} = geograficaApi;
