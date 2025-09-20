import React from "react";
import ReactECharts from "echarts-for-react";
import { useGetPorDepartamentoQuery } from "../api/geografica/geograficaApi";

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

export default function GraficoTotalAyudasPorDepartamento({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useGetPorDepartamentoQuery({
    per_page: 50,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Sumar todos los tipos de ayuda por departamento
  const departamentos = results.map((d: any) => d.departamento);
  const totalAyudas = results.map((d: any) =>
    tiposAyuda.reduce((acc, tipo) => acc + (d[tipo] || 0), 0)
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.axisValue}<br/>Total de productos distribuidos: <b>${p.data}</b>`;
      },
    },
    xAxis: {
      type: "category",
      data: departamentos,
      axisLabel: { rotate: 30 },
    },
    yAxis: {
      type: "value",
      name: "Total de productos distribuidos",
    },
    series: [
      {
        data: totalAyudas,
        type: "bar",
        color: "#10b981",
        barWidth: 24,
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
        },
      },
    ],
    grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
