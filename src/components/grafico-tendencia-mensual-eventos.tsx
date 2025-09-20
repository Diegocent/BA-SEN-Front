import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import { useTendenciaMensualAsistenciasQuery } from "@/api";

const eventos = [
  "EXTREMA VULNERABILIDAD",
  "TORMENTA SEVERA",
  "INUNDACION",
  "SEQUIA",
  "COVID",
  "OTROS",
  "C.I.D.H.",
  "INCENDIO",
  "OPERATIVO JAHO'I",
  "OLLA POPULAR",
];

export default function GraficoTendenciaMensualEventos({
  fecha_inicio = "",
  fecha_fin = "",
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
}) {
  const [evento, setEvento] = useState(eventos[0]);
  const { data, isLoading, isError } = useTendenciaMensualAsistenciasQuery({
    per_page: 100,
    evento,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  const results = Array.isArray(data) ? data : data?.results || [];
  const sorted = [...results].sort((a, b) => {
    if (a.anio !== b.anio) return a.anio - b.anio;
    return (a.mes || 0) - (b.mes || 0);
  });

  const labels = sorted.map((item) => `${item.nombre_mes} ${item.anio}`);
  const valores = sorted.map((item) => item.numero_asistencias || 0);

  const option = {
    tooltip: { trigger: "axis" },
    grid: { left: 80, right: 20, bottom: 50, top: 50, containLabel: true },
    xAxis: {
      type: "category",
      data: labels,
      name: "Mes",
      nameLocation: "middle",
      nameGap: 30,
      axisLabel: { rotate: 45 },
    },
    yAxis: {
      type: "value",
      name: "Cantidad de eventos",
      nameLocation: "middle",
      nameGap: 60,
    },
    series: [
      {
        data: valores,
        type: "line",
        smooth: true,
        color: "#10b981",
        label: {
          show: false,
        },
      },
    ],
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Evento:</label>
        <select value={evento} onChange={(e) => setEvento(e.target.value)}>
          {eventos.map((ev) => (
            <option key={ev} value={ev}>
              {ev}
            </option>
          ))}
        </select>
      </div>
      <h3 style={{ marginBottom: 8 }}>
        Tendencia mensual de eventos: {evento}
      </h3>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        opts={{ renderer: "canvas", devicePixelRatio: 2 }}
      />
    </div>
  );
}
