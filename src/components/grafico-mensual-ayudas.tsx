import React from "react";
import ReactECharts from "echarts-for-react";
import { useGetMensualQuery } from "@/api";

const monthLabels = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function GraficoMensual() {
  const { data, isLoading, error } = useGetMensualQuery({ per_page: 100 });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (error) return <div>Error al cargar datos</div>;

  // Agrupar por año y mes
  const grouped: Record<string, number[]> = {};
  (data?.results || []).forEach((item: any) => {
    const year = item.anio;
    const monthIdx = item.mes - 1;
    if (!grouped[year]) grouped[year] = Array(12).fill(0);
    grouped[year][monthIdx] = item.unidades_distribuidas || 0;
  });

  const series = Object.keys(grouped).map((year) => ({
    name: year,
    type: "bar",
    stack: "total",
    data: grouped[year],
    label: { show: true, position: "top", fontSize: 10 },
  }));

  const option = {
    tooltip: { trigger: "axis" },
    legend: { top: 10 },
    grid: { left: 40, right: 20, bottom: 50, top: 50, containLabel: true },
    xAxis: {
      type: "category",
      data: monthLabels,
      name: "Mes",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "Cantidad de ayudas",
      nameLocation: "middle",
      nameGap: 40,
    },
    series,
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
      <h3 style={{ marginBottom: 8 }}>Ayudas mensuales por año</h3>
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
}
