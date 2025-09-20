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

export default function GraficoMensual({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, error } = useGetMensualQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (error) return <div>Error al cargar datos</div>;

  // Verificar si hay datos y procesar solo los datos recibidos
  const results = data?.results || [];

  // Si no hay datos, mostrar mensaje
  if (results.length === 0) {
    return <div>No hay datos para el período seleccionado</div>;
  }

  // Agrupar por año y mes usando SOLO los datos recibidos del query
  const grouped: Record<string, number[]> = {};

  results.forEach((item: any) => {
    const year = item.anio;
    const monthIdx = item.mes - 1;

    if (!grouped[year]) {
      grouped[year] = Array(12).fill(0);
    }

    grouped[year][monthIdx] = item.unidades_distribuidas || 0;
  });

  // Obtener solo los años que realmente tienen datos
  const availableYears = Object.keys(grouped);

  const series = availableYears.map((year) => ({
    name: year,
    type: "bar",
    stack: "total",
    data: grouped[year],
    label: {
      show: false,
      position: "top",
      fontSize: 10,
    },
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      // Restauramos el tooltip original sin formatter personalizado
    },
    legend: {
      top: 10,
      data: availableYears, // Solo mostramos los años disponibles
    },
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
      <ReactECharts option={option} style={{ height: 320 }} />
    </div>
  );
}
