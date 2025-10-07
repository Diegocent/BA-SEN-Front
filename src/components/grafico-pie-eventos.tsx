import React from "react";
import ReactECharts from "echarts-for-react";
import { useGetPorEventoQuery } from "../api/eventos/eventosApi";

interface Props {
  fecha_inicio?: string;
  fecha_fin?: string;
  setInundaciones?: (value: number) => void;
  setSequias?: (value: number) => void;
  setIncendios?: (value: number) => void;
  setTormentas?: (value: number) => void;
}

export default function GraficoPieEventos({
  fecha_inicio,
  fecha_fin,
  setInundaciones,
  setSequias,
  setIncendios,
  setTormentas,
}: Props) {
  const { data, isLoading, isError } = useGetPorEventoQuery({
    per_page: 100,
    fecha_desde: fecha_inicio,
    fecha_hasta: fecha_fin,
  });
  // Usar data.results para paginación DRF, o data directo si no existe results
  const results = Array.isArray(data) ? data : data?.results || [];
  // Actualizar los contadores de eventos específicos
  React.useEffect(() => {
    if (
      !results ||
      results.length === 0 ||
      !setInundaciones ||
      !setSequias ||
      !setIncendios ||
      !setTormentas
    )
      return;
    const eventosCount = results.reduce(
      (acc: any, item: any) => {
        switch (item.evento) {
          case "INUNDACION":
            acc.inundaciones += item.numeroOcurrencias || 0;
            break;
          case "SEQUIA":
            acc.sequias += item.numeroOcurrencias || 0;
            break;
          case "INCENDIO":
            acc.incendios += item.numeroOcurrencias || 0;
            break;
          case "TORMENTA SEVERA":
            acc.tormentas += item.numeroOcurrencias || 0;
            break;
          default:
            break;
        }
        return acc;
      },
      { inundaciones: 0, sequias: 0, incendios: 0, tormentas: 0 }
    );
    setInundaciones(eventosCount.inundaciones);
    setSequias(eventosCount.sequias);
    setIncendios(eventosCount.incendios);
    setTormentas(eventosCount.tormentas);
  }, [results]);

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  const pieData = results.map((item: any) => ({
    name: item.evento,
    value: item.numeroOcurrencias || item.numero_ocurrencias || item.count || 0,
  }));

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: 10,
      textStyle: { fontSize: 14 },
      icon: "circle",
      itemWidth: 18,
      itemHeight: 12,
    },
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
    series: [
      {
        name: "Eventos",
        type: "pie",
        radius: "60%",
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        label: {
          show: true,
          formatter: "{b}: {d}%",
          fontSize: 14,
        },
      },
    ],
    toolbox: {
      feature: {
        saveAsImage: { pixelRatio: 2, title: "Descargar imagen" },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
