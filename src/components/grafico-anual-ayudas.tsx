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
    backgroundColor: "#fff",
    color: [
      "#5470C6",
      "#91CC75",
      "#EE6666",
      "#FAC858",
      "#73C0DE",
      "#3BA272",
      "#FC8452",
      "#9A60B4",
      "#EA7CCC",
    ],
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    legend: {
      bottom: 0,
      textStyle: { fontSize: 14 },
      icon: "rect",
      itemWidth: 18,
      itemHeight: 12,
    },
    grid: { left: 40, right: 20, bottom: 60, top: 30, containLabel: true },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
      nameLocation: "middle",
      nameGap: 18,
      axisLabel: { fontSize: 14, rotate: 0 },
      nameTextStyle: { fontWeight: "bold", fontSize: 16 },
    },
    yAxis: {
      type: "value",
      name: "Unidades distribuidas",
      nameLocation: "middle",
      nameGap: 80,
      axisLabel: { fontSize: 14 },
      nameTextStyle: { fontWeight: "bold", fontSize: 16 },
    },
    series,
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Asistencias_anuales",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 8 }}>
      <ReactECharts
        option={option}
        style={{ height: 320 }}
        opts={{ devicePixelRatio: 2 }}
      />
    </div>
  );
}
