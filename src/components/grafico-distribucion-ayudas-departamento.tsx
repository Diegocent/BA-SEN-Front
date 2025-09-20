import React from "react";
import ReactECharts from "echarts-for-react";
import { useGetPorDepartamentoQuery } from "../api";

const tiposAyuda = [
  "kit_sentencia",
  "kit_evento",
  "chapa_fibrocemento_cantidad",
  "chapa_zinc_cantidad",
  "colchones_cantidad",
  "frazadas_cantidad",
  "terciadas_cantidad",
  "puntales_cantidad",
  "carpas_plasticas_cantidad",
];

const ayudaLabels: Record<string, string> = {
  kit_sentencia: "Kit Sentencia",
  kit_evento: "Kit Evento",
  chapa_fibrocemento_cantidad: "Chapa Fibrocemento",
  chapa_zinc_cantidad: "Chapa Zinc",
  colchones_cantidad: "Colchones",
  frazadas_cantidad: "Frazadas",
  terciadas_cantidad: "Terciadas",
  puntales_cantidad: "Puntales",
  carpas_plasticas_cantidad: "Carpas Plásticas",
};

export default function GraficoDistribucionAyudasDepartamento() {
  const { data, isLoading, isError } = useGetPorDepartamentoQuery({
    per_page: 18,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];
  const departamentos = results.map((d: any) => d.departamento);

  const series = tiposAyuda.map((tipo) => ({
    name: ayudaLabels[tipo] || tipo,
    type: "bar",
    stack: "total",
    emphasis: { focus: "series" },
    data: results.map((d: any) => d[tipo] || 0),
  }));

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { bottom: 0 },
    grid: { left: "3%", right: "4%", top: 30, bottom: 60, containLabel: true },
    xAxis: {
      type: "category",
      data: departamentos,
      axisLabel: {
        rotate: 30,
        margin: 16,
      },
    },
    yAxis: { type: "value" },
    series,
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>
        Distribución de ayudas por departamento
      </h3>
      <ReactECharts option={option} style={{ height: 400, marginTop: 0 }} />
    </div>
  );
}
