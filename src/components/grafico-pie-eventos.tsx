import React from "react";
import ReactECharts from "echarts-for-react";
import { useGetPorEventoQuery } from "../api/eventos/eventosApi";

export default function GraficoPieEventos() {
  const { data, isLoading, isError } = useGetPorEventoQuery({ per_page: 100 });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  const pieData = results.map((item: any) => ({
    name: item.evento,
    value: item.numeroOcurrencias || item.numero_ocurrencias || item.count || 0,
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Eventos",
        type: "pie",
        radius: "60%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          formatter: "{b}: {c} ({d}%)",
        },
      },
    ],
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>Distribución de eventos (pie)</h3>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: "canvas", devicePixelRatio: 3 }}
      />
    </div>
  );
}
