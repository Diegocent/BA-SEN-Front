import React from "react";
import ReactECharts from "echarts-for-react";
import { useTendenciaMensualAsistenciasQuery } from "../api/temporal/temporalApi";

export default function GraficoTendenciaMensual() {
  const { data, isLoading, isError } = useTendenciaMensualAsistenciasQuery({
    per_page: 100,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Eje X: año-mes, Eje Y: numero_asistencias
  const xData = results.map(
    (item: any) => `${item.anio || ""}-${item.nombre_mes || item.mes || ""}`
  );
  const yData = results.map(
    (item: any) => item.numero_asistencias || item.numeroAsistencias || 0
  );

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        return `${p.axisValue}<br/>Asistencias: <b>${p.data}</b>`;
      },
    },
    xAxis: {
      type: "category",
      data: xData,
      axisLabel: { rotate: 30 },
    },
    yAxis: {
      type: "value",
      name: "Cantidad de asistencias",
    },
    series: [
      {
        data: yData,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        // Sin área de relleno
        lineStyle: { width: 1 },
        color: "#3b82f6",
      },
    ],
    grid: {
      left: "4%",
      right: "4%",
      top: "8%",
      bottom: "10%",
      containLabel: true,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 2 }}>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
