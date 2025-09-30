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
      left: "left",
    },
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
          formatter: "{b}: {c} ({d}%)",
        },
      },
    ],
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginBottom: 8 }}>Distribución de eventos (pie)</h3>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: "canvas", devicePixelRatio: 3 }}
      />
    </div>
  );
}
