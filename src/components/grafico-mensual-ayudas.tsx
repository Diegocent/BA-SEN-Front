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

interface GraficoMensualProps {
  fecha_inicio?: string;
  fecha_fin?: string;
  setPicoMaximo?: (value: { mes: string; anio: number; valor: number }) => void;
  setTendencia?: (value: {
    crecimiento: number;
    direccion: "ascendente" | "descendente" | "estable";
  }) => void;
  setPromedio?: (value: number) => void;
  setVariabilidad?: (value: number) => void;
}

export default function GraficoMensual({
  fecha_inicio = "",
  fecha_fin = "",
  setPicoMaximo,
  setTendencia,
  setPromedio,
  setVariabilidad,
}: GraficoMensualProps) {
  const { data, isLoading, error } = useGetMensualQuery({
    per_page: 100,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  // Efecto para calcular y enviar las métricas cuando los datos cambian
  React.useEffect(() => {
    if (data?.results && data.results.length > 0) {
      const results = data.results;

      // 1. Pico Máximo - Mes con mayor unidades distribuidas
      const picoMaximo = results.reduce((max, item) => {
        return item.unidades_distribuidas > max.unidades_distribuidas
          ? item
          : max;
      }, results[0]);

      setPicoMaximo?.({
        mes: picoMaximo.nombre_mes,
        anio: picoMaximo.anio,
        valor: picoMaximo.unidades_distribuidas,
      });

      // 3. Tendencia - Crecimiento anual (versión mejorada con regresión lineal)
      const datosPorAnio: Record<number, number> = {};
      results.forEach((item) => {
        if (!datosPorAnio[item.anio]) {
          datosPorAnio[item.anio] = 0;
        }
        datosPorAnio[item.anio] += item.unidades_distribuidas;
      });

      const anos = Object.keys(datosPorAnio).map(Number).sort();
      let crecimiento = 0;
      let direccion: "ascendente" | "descendente" | "estable" = "estable";

      if (anos.length >= 2) {
        // Calcular tendencia usando regresión lineal simple
        let sumX = 0,
          sumY = 0,
          sumXY = 0,
          sumX2 = 0;
        const n = anos.length;

        anos.forEach((ano, index) => {
          const x = index; // Posición temporal (0, 1, 2, ...)
          const y = datosPorAnio[ano]; // Valor del año
          sumX += x;
          sumY += y;
          sumXY += x * y;
          sumX2 += x * x;
        });

        // Fórmula de la pendiente en regresión lineal: m = (n*ΣXY - ΣX*ΣY) / (n*ΣX² - (ΣX)²)
        const pendiente = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

        // Calcular el promedio de Y para obtener crecimiento porcentual
        const promedioY = sumY / n;
        const crecimientoPorcentual =
          promedioY !== 0 ? (pendiente / promedioY) * 100 : 0;

        direccion =
          pendiente > 0
            ? "ascendente"
            : pendiente < 0
            ? "descendente"
            : "estable";
        crecimiento = Math.round(crecimientoPorcentual * 100) / 100;
      }

      setTendencia?.({
        crecimiento: crecimiento,
        direccion,
      });

      // 4. Promedio - Eventos por mes (usando unidades_distribuidas como proxy de "eventos")
      const promedio =
        results.reduce((sum, item) => sum + item.unidades_distribuidas, 0) /
        results.length;
      setPromedio?.(Math.round(promedio * 100) / 100);

      // 5. Variabilidad - Desviación estándar de unidades distribuidas
      const media = promedio;
      const sumaCuadrados = results.reduce((sum, item) => {
        return sum + Math.pow(item.unidades_distribuidas - media, 2);
      }, 0);
      const desviacionEstandar = Math.sqrt(sumaCuadrados / results.length);
      setVariabilidad?.(Math.round(desviacionEstandar * 100) / 100);
    }
  }, [data]); // <-- Solo depende de data

  if (isLoading) return <div>Cargando gráfico...</div>;
  if (error) return <div>Error al cargar datos</div>;

  const results = data?.results || [];

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
    },
    legend: {
      top: 10,
      data: availableYears,
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
