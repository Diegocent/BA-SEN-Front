import React, { useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { useGetPorDepartamentoQuery } from "../api/geografica/geograficaApi";

const tiposAyuda = [
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

export default function GraficoTotalAyudasPorDepartamento({
  fecha_inicio = "",
  fecha_fin = "",
  setTopDepartamento,
}: {
  fecha_inicio?: string;
  fecha_fin?: string;
  setTopDepartamento?: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { data, isLoading, isError } = useGetPorDepartamentoQuery({
    per_page: 50,
    ...(fecha_inicio && fecha_fin
      ? { fecha_desde: fecha_inicio, fecha_hasta: fecha_fin }
      : {}),
  });

  // Siempre se ejecuta este hook
  const results = Array.isArray(data) ? data : data?.results || [];

  useEffect(() => {
    if (setTopDepartamento && results.length > 0) {
      const top = results.reduce((max: any, d: any) =>
        d.unidades_distribuidas > max.unidades_distribuidas ? d : max
      );
      setTopDepartamento(top.departamento);
    }
  }, [results, setTopDepartamento]);

  // Ahora sí condicionar el render, después de los hooks
  if (isLoading) return <div>Cargando gráfico...</div>;
  if (isError || !data) return <div>Error al cargar los datos.</div>;

  const departamentos = results.map((d: any) => d.departamento);
  const totalAyudas = results.map((d: any) =>
    tiposAyuda.reduce((acc, tipo) => acc + (d[tipo] || 0), 0)
  );
  const sumaTotal = totalAyudas.reduce((a: number, b: number) => a + b, 0);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (params: any) => {
        const p = params[0];
        const porcentaje = sumaTotal
          ? ((p.data / sumaTotal) * 100).toFixed(1)
          : 0;
        return `${p.axisValue}<br/>Total de productos distribuidos: <b>${p.data}</b><br/>Porcentaje: <b>${porcentaje}%</b>`;
      },
    },
    xAxis: {
      type: "category",
      data: departamentos,
      axisLabel: { rotate: 30, fontSize: 12 },
      nameLocation: "middle",
      name: "Departamentos",
      nameGap: 65,
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    yAxis: {
      type: "value",
      name: "Total de unidades distribuidas",
      nameLocation: "middle",
      nameGap: 75,
      axisLabel: { fontSize: 12 },
      nameTextStyle: { fontWeight: "bold", fontSize: 14 },
    },
    series: [
      {
        data: totalAyudas,
        type: "bar",
        color: "#6c71d5",
        barWidth: 24,
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
          formatter: function (params: any) {
            const porcentaje = sumaTotal
              ? ((params.data / sumaTotal) * 100).toFixed(1)
              : 0;
            return `${porcentaje}%`;
          },
        },
      },
    ],
    grid: { left: "5%", right: "4%", bottom: "10%", containLabel: true },
    toolbox: {
      feature: {
        saveAsImage: {
          pixelRatio: 2,
          title: "Descargar imagen",
          name: "Total_asistencias_por_departamento",
        },
      },
      right: 10,
    },
  };

  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 0 }}>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
