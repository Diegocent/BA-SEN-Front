import React from "react";
import ReactECharts from "echarts-for-react";
import { useAsistenciasPorEventoQuery } from "@/api";

export default function GraficoAyudasPorEvento({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useAsistenciasPorEventoQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Ordenar por unidades_distribuidas descendente
  const sorted = [...results].sort(
    (a, b) => (b.unidades_distribuidas || 0) - (a.unidades_distribuidas || 0)
  );

  const eventos = sorted.map((item) => item.evento);
  const ayudas = sorted.map((item) => item.unidades_distribuidas || 0);

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 25, right: 10, bottom: 10, top: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: eventos,
      name: "Evento",
      nameLocation: "middle",
      nameGap: 90,
      axisLabel: { rotate: 90 },
    },
    yAxis: {
      type: "value",
      name: "Total ayudas",
      nameLocation: "middle",
      nameGap: 75,
    },
    series: [
      {
        data: ayudas,
        type: "bar",
        color: "#ff8100",
        barWidth: 16,
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
          fontSize: 8,
        },
      },
    ],
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 2 }}>
      <ReactECharts
        option={option}
        style={{ height: 400, width: "100%" }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
