import { api } from "../api";

export const eventosApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPorEvento: builder.query({
      // params: { id, ... }
      query: (params) => ({
        url: "por-evento/",
        params,
      }),
    }),
    asistenciasPorEvento: builder.query({
      query: (params) => ({
        url: "asistencias-por-evento/",
        params,
      }),
    }),
    composicionAyudasPorEvento: builder.query({
      query: (params) => ({
        url: "composicion-ayudas-por-evento/",
        params,
      }),
    }),
    ocurrenciasEventoAnual: builder.query({
      query: (params) => ({
        url: "ocurrencias-evento-anual/",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPorEventoQuery,
  useAsistenciasPorEventoQuery,
  useComposicionAyudasPorEventoQuery,
  useOcurrenciasEventoAnualQuery,
} = eventosApi;
