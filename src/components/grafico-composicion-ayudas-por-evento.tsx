import React from "react";
import ReactECharts from "echarts-for-react";
import { useComposicionAyudasPorEventoQuery } from "@/api";

export default function GraficoComposicionAyudasPorEvento() {
  const { data, isLoading, isError } = useComposicionAyudasPorEventoQuery({
    per_page: 100,
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];

  // Tipos de ayuda a mostrar
  const tipos = [
    { key: "kit_sentencia", label: "Kit sentencia" },
    { key: "kit_evento", label: "Kit evento" },
    { key: "chapa_fibrocemento_cantidad", label: "Chapa fibrocemento" },
    { key: "chapa_zinc_cantidad", label: "Chapa zinc" },
    { key: "colchones_cantidad", label: "Colchones" },
    { key: "frazadas_cantidad", label: "Frazadas" },
    { key: "terciadas_cantidad", label: "Terciadas" },
    { key: "puntales_cantidad", label: "Puntales" },
    { key: "carpas_plasticas_cantidad", label: "Carpas plásticas" },
  ];

  const eventos = results.map((item: { evento: any }) => item.evento);

  const series = tipos.map((tipo) => ({
    name: tipo.label,
    type: "bar",
    stack: "total",
    emphasis: { focus: "series" },
    data: results.map((item: { [x: string]: any }) => item[tipo.key] || 0),
    label: { show: false, position: "inside", fontSize: 10 },
  }));

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { bottom: 10 },
    grid: { left: 80, right: 20, bottom: 50, top: 20, containLabel: true },
    xAxis: {
      type: "category",
      data: eventos,
      name: "Evento",
      nameLocation: "middle",
      nameGap: 75,
      axisLabel: { rotate: 30 },
    },
    yAxis: {
      type: "value",
      name: "Cantidad de ayudas",
      nameLocation: "middle",
      nameGap: 60,
    },
    series,
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 2 }}>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
