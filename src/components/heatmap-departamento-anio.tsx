import React from "react";
import ReactECharts from "echarts-for-react";
import { useAsistenciasPorAnioDepartamentoQuery } from "../api/geografica/geograficaApi";

export default function HeatmapDepartamentoAnio({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const { data, isLoading, isError } = useAsistenciasPorAnioDepartamentoQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando heatmap...</div>;
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

  // Eje Y: departamentos únicos ordenados
  const departamentos = Array.from(
    new Set(results.map((item: any) => item.departamento))
  ).sort();
  // Eje X: años únicos ordenados
  const anios = Array.from(
    new Set(results.map((item: any) => item.anio))
  ).sort();

  const dataMatrix: [number, number, number][] = [];
  results.forEach((item: any) => {
    const deptoIdx = departamentos.indexOf(item.departamento);
    const anioIdx = anios.indexOf(item.anio);
    const total = ayudaFields.reduce((acc, f) => acc + (item[f] || 0), 0);
    if (deptoIdx !== -1 && anioIdx !== -1) {
      dataMatrix.push([anioIdx, deptoIdx, total]);
    }
  });

  const option = {
    tooltip: {
      position: "top",
      formatter: (params: any) => {
        const anio = anios[params.data[0]];
        const depto = departamentos[params.data[1]];
        const value = params.data[2];
        return `${depto} - ${anio}: <b>${value}</b>`;
      },
    },
    grid: {
      height: "60%",
      top: 20,
      left: "11%",
      right: 40,
      bottom: 40,
    },
    xAxis: {
      type: "category",
      data: anios,
      name: "Año",
      splitArea: { show: true },
      axisLabel: { rotate: 0, fontSize: 12 },
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "category",
      data: departamentos,
      name: "Departamento",
      splitArea: { show: true },
      nameLocation: "middle",
      nameGap: 90,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    visualMap: {
      min: 0,
      max: Math.max(...dataMatrix.map((d) => d[2]), 10),
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: 25,
      inRange: {
        color: ["#fee2e2", "#fca5a5", "#ef4444", "#991b1b"],
      },
    },
    series: [
      {
        name: "Ayudas",
        type: "heatmap",
        data: dataMatrix,
        label: {
          show: true,
          color: "#222",
          fontWeight: "bold",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.5)",
          },
        },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Heatmap_Departamento_Anio",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <ReactECharts
        option={option}
        style={{ height: 450 }}
        opts={{ devicePixelRatio: 2 }}
      />
    </div>
  );
}
