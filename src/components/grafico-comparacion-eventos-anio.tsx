import React from "react";
import ReactECharts from "echarts-for-react";
import { useOcurrenciasEventoAnualQuery } from "@/api";

export default function GraficoComparacionEventosAnio({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useOcurrenciasEventoAnualQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Obtener años y eventos únicos
  const anios = Array.from(
    new Set(results.map((item: any) => item.anio))
  ).sort();
  const eventos = Array.from(new Set(results.map((item: any) => item.evento)));

  // Construir series agrupadas por evento
  const series = eventos.map((evento) => ({
    name: evento,
    type: "bar",
    stack: undefined, // barras agrupadas
    data: anios.map((anio) => {
      const found = results.find(
        (item: any) => item.anio === anio && item.evento === evento
      );
      return found
        ? found.numeroOcurrencias || found.numero_ocurrencias || 0
        : 0;
    }),
    label: { show: false },
  }));

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { bottom: 10 },
    grid: { left: 35, right: 20, bottom: 120, top: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Cantidad de eventos",
      nameLocation: "middle",
      nameGap: 60,
    },
    series,
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Comparacion_eventos_anio",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
