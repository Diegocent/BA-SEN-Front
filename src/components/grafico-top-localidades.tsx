import React from "react";
import ReactECharts from "echarts-for-react";
import { useEventosPorLocalidadQuery } from "../api/geografica/geograficaApi";

export default function GraficoTopLocalidades({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  // Solo mostrar el top 5 en el frontend
  const TOP_N = 5;
  const { data, isLoading, isError } = useEventosPorLocalidadQuery({
    per_page: 50,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Filtrar SIN ESPECIFICAR, ordenar y tomar el top N
  const topLocalidades = [...results]
    .filter((d) => d.localidad && d.localidad !== "SIN ESPECIFICAR")
    .sort((a, b) => (b.numero_eventos || 0) - (a.numero_eventos || 0))
    .slice(0, TOP_N);

  const localidades = topLocalidades.map((d: any) => d.localidad);
  const eventos = topLocalidades.map((d: any) => d.numero_eventos || 0);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.axisValue}<br/>Eventos: <b>${p.data}</b>`;
      },
    },
    xAxis: {
      type: "value",
      name: "Eventos",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "category",
      data: localidades,
      name: "Localidades",
      nameLocation: "middle",
      nameGap: 120,
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
      axisLabel: { rotate: 0, fontSize: 12 },
    },
    series: [
      {
        data: eventos,
        type: "bar",
        color: "#6366f1",
        barWidth: 18,
        label: {
          show: true,
          position: "right",
          fontWeight: "bold",
          fontSize: 12,
        },
      },
    ],
    grid: { left: 15, right: 20, bottom: 30, top: 50, containLabel: true },
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Top_localidades_eventos",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 2 }}>
      <ReactECharts option={option} style={{ height: 380 }} />
    </div>
  );
}
