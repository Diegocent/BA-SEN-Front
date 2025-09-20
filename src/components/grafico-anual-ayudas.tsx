import React from "react";
import ReactECharts from "echarts-for-react";
import { useGetAnualQuery } from "@/api";

export default function GraficoAnualAyudas({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, error } = useGetAnualQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (error) return <div>Error al cargar datos</div>;

  // Estructura: cada barra es un año, apilada por tipo de ayuda
  const results = data?.results || [];
  const anios = results.map((item: any) => item.anio);

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

  const series = tipos.map((tipo) => ({
    name: tipo.label,
    type: "bar",
    stack: "total",
    emphasis: { focus: "series" },
    data: results.map((item: any) => item[tipo.key] || 0),
    label: { show: false, position: "inside", fontSize: 10 },
  }));

  const option = {
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: { bottom: 10 },
    grid: { left: 40, right: 20, bottom: 50, top: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
      nameLocation: "middle",
      nameGap: 30,
    },
    yAxis: {
      type: "value",
      name: "unidades_distribuidas",
      nameLocation: "middle",
      nameGap: 40,
    },
    series,
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
}
