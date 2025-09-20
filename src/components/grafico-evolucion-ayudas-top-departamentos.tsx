import React from "react";
import ReactECharts from "echarts-for-react";
import { useAsistenciasPorAnioDepartamentoQuery } from "../api/geografica/geograficaApi";

export default function GraficoEvolucionAyudasTopDepartamentos({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const TOP_N = 5;
  const { data, isLoading, isError } = useAsistenciasPorAnioDepartamentoQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Agrupar por departamento y año, sumar total ayudas
  const ayudaFields = [
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

  // Agrupar por departamento
  const agrupado: Record<string, { anio: number; total: number }[]> = {};
  results.forEach((item: any) => {
    const depto = item.departamento;
    const anio = item.anio;
    const total = ayudaFields.reduce((acc, f) => acc + (item[f] || 0), 0);
    if (!agrupado[depto]) agrupado[depto] = [];
    agrupado[depto].push({ anio, total });
  });

  // Calcular top N departamentos por suma total
  const topDepartamentos = Object.entries(agrupado)
    .map(([depto, arr]) => ({
      departamento: depto,
      total: arr.reduce((acc, v) => acc + v.total, 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, TOP_N)
    .map((d) => d.departamento);

  // Eje X: años únicos ordenados
  const anios = Array.from(
    new Set(results.map((item: any) => item.anio))
  ).sort();

  // Colores personalizados para cada departamento
  const colores = [
    "#3b82f6",
    "#10b981",
    "#f59e42",
    "#ef4444",
    "#a855f7",
    "#6366f1",
    "#f43f5e",
    "#fbbf24",
    "#22d3ee",
    "#64748b",
  ];
  // Series: una por departamento
  const series = topDepartamentos.map((depto, idx) => ({
    name: depto,
    type: "line",
    symbol: "circle",
    symbolSize: 6,
    lineStyle: { width: 1.5 },
    color: colores[idx % colores.length],
    data: anios.map((anio) => {
      const found = (agrupado[depto] || []).find((v) => v.anio === anio);
      return found ? found.total : 0;
    }),
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        let str = `${params[0].axisValue}<br/>`;
        params.forEach((p: any) => {
          str += `${p.marker} ${p.seriesName}: <b>${p.data}</b><br/>`;
        });
        return str;
      },
    },
    legend: { top: 0 },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
    },
    yAxis: {
      type: "value",
      name: "Total ayudas",
    },
    series,
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
