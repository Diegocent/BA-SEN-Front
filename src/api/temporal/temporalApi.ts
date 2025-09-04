import { api } from "../api";

export const temporalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAnual: builder.query({
      query: (params) => ({
        url: "anual/",
        params,
      }),
    }),
    getMensual: builder.query({
      query: (params) => ({
        url: "mensual/",
        params,
      }),
    }),
    tendenciaMensualAsistencias: builder.query({
      query: (params) => ({
        url: "tendencia-mensual-asistencias/",
        params,
      }),
    }),
    distribucionMensualDetallada: builder.query({
      query: (params) => ({
        url: "distribucion-mensual-detallada/",
        params,
      }),
    }),
    distribucionAnualProducto: builder.query({
      query: (params) => ({
        url: "distribucion-anual-producto/",
        params,
      }),
    }),
    asistenciasPorAnioDepartamento: builder.query({
      query: (params) => ({
        url: "asistencias-por-anio-departamento/",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnualQuery,
  useGetMensualQuery,
  useTendenciaMensualAsistenciasQuery,
  useDistribucionMensualDetalladaQuery,
  useDistribucionAnualProductoQuery,
  useAsistenciasPorAnioDepartamentoQuery,
} = temporalApi;
