import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Column, DataTable } from "../../data-table";
import { useGetAnualQuery, useGetMensualQuery } from "@/api";
import GraficoMensual from "../../grafico-mensual-ayudas";
import GraficoAnualAyudas from "../../grafico-anual-ayudas";
import GraficoDistribucionAnualProducto from "../../grafico-distribucion-anual-producto";
import GraficoTendenciaMensual from "../../grafico-tendencia-mensual";
import { useState, useEffect } from "react";
import { generateTablePDF } from "@/lib/pdfUtils";
import { ObtenerTotalData } from "@/hooks/obtenerTotalData";
import {
  columnasAnual,
  columnasMensual,
  columnasAnualPDF,
  columnasMensualPDF,
} from "./constants/constants";
import VisualizarDetallesGenericos from "@/components/VisualizarDetallesGenericos";

interface MetricasTemporales {
  picoMaximo: { mes: string; anio: number; valor: number } | null;
  tendencia: {
    crecimiento: number;
    direccion: "ascendente" | "descendente" | "estable";
  } | null;
  promedio: number | null;
  variabilidad: number | null;
}

export function AnalisisTemporal() {
  // Filtro global de fechas
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  // Estado para las métricas
  const [metricas, setMetricas] = useState<MetricasTemporales>({
    picoMaximo: null,
    tendencia: null,
    promedio: null,
    variabilidad: null,
  });

  // Estado para filtros y página para anual
  const [filtersAnual, setFiltersAnual] = useState<Record<string, any>>({});
  const [pageUrlAnual, setPageUrlAnual] = useState<string | null>(null);
  const { page: pageAnual, ...filtersAnualWithoutPage } = filtersAnual;
  const pageParamAnual = pageUrlAnual
    ? {
        page: pageUrlAnual.includes("page=")
          ? pageUrlAnual.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParamsAnual = {
    ...filtersAnualWithoutPage,
    ...pageParamAnual,
    ...dateParams,
  };

  // Estado para filtros y página para mensual
  const [filtersMensual, setFiltersMensual] = useState<Record<string, any>>({});
  const [pageUrlMensual, setPageUrlMensual] = useState<string | null>(null);
  const { page: pageMensual, ...filtersMensualWithoutPage } = filtersMensual;
  const pageParamMensual = pageUrlMensual
    ? {
        page: pageUrlMensual.includes("page=")
          ? pageUrlMensual.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const queryParamsMensual = {
    ...filtersMensualWithoutPage,
    ...pageParamMensual,
    ...dateParams,
  };

  // PDF params y handlers para ANUAL
  const [pdfParamAnual, setPdfParamAnual] = useState({});
  useEffect(() => {
    setPdfParamAnual({ ...filtersAnualWithoutPage, ...dateParams });
  }, [filtersAnual, dateRange]);

  const handleImprimirPDFAnual = async () => {
    const registrosTotales = await ObtenerTotalData(
      "",
      "anual",
      pdfParamAnual,
      dataAnual?.count || 10
    );
    generateTablePDF({
      columns: columnasAnualPDF,
      data: registrosTotales?.results || [],
      title: "Resumen Anual",
    });
  };

  // PDF params y handlers para MENSUAL
  const [pdfParamMensual, setPdfParamMensual] = useState({});
  useEffect(() => {
    setPdfParamMensual({ ...filtersMensualWithoutPage, ...dateParams });
  }, [filtersMensual, dateRange]);

  const handleImprimirPDFMensual = async () => {
    const registrosTotales = await ObtenerTotalData(
      "",
      "mensual",
      pdfParamMensual,
      dataMensual?.count || 10
    );
    generateTablePDF({
      columns: columnasMensualPDF,
      data: registrosTotales?.results || [],
      title: "Detalle Mensual",
    });
  };

  // Paginación para anual
  const {
    data: dataAnual,
    // error: errorAnual,
    // isLoading: isLoadingAnual,
  } = useGetAnualQuery(queryParamsAnual) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para mensual
  const {
    data: dataMensual,
    // error: errorMensual,
    // isLoading: isLoadingMensual,
  } = useGetMensualQuery(queryParamsMensual) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Función para formatear números grandes
  const formatNumber = (num: number | null): string => {
    if (num === null) return "-";
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  // Función para obtener el color según la dirección de la tendencia
  const getTendenciaColor = (direccion: string) => {
    switch (direccion) {
      case "ascendente":
        return "text-success";
      case "descendente":
        return "text-danger";
      default:
        return "text-warning";
    }
  };

  // Función para obtener el ícono de tendencia
  const getTendenciaIcono = (direccion: string) => {
    switch (direccion) {
      case "ascendente":
        return "↗";
      case "descendente":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Filtro global de fechas */}
      <div className="flex gap-4 items-center mb-4">
        <label className="font-semibold">Rango de fechas:</label>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange((r) => ({ ...r, startDate: e.target.value }))
          }
          className="border rounded px-2 py-1"
        />
        <span className="mx-2">a</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange((r) => ({ ...r, endDate: e.target.value }))
          }
          className="border rounded px-2 py-1"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Análisis Temporal
        </h1>
        <p className="text-muted-foreground">
          Evolución temporal de los datos de asistencia humanitaria
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Tendencias Temporales
            </CardTitle>
            <CardDescription>
              Evolución de la asistencia humanitaria a lo largo del tiempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                paddingLeft: 5,
                paddingRight: 5,
                width: "100%",
              }}
            >
              <GraficoTendenciaMensual
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </motion.div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Análisis por Año</CardTitle>
              <CardDescription>Distribución anual de eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoAnualAyudas
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">Análisis por Mes</CardTitle>
              <CardDescription>Patrones estacionales</CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoMensual
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
                setPicoMaximo={(value) =>
                  setMetricas((prev) => ({ ...prev, picoMaximo: value }))
                }
                setTendencia={(value) =>
                  setMetricas((prev) => ({ ...prev, tendencia: value }))
                }
                setPromedio={(value) =>
                  setMetricas((prev) => ({ ...prev, promedio: value }))
                }
                setVariabilidad={(value) =>
                  setMetricas((prev) => ({ ...prev, variabilidad: value }))
                }
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-success">
              Distribución anual de ayuda principal
            </CardTitle>
            <CardDescription>
              Selecciona el producto para ver su evolución anual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoDistribucionAnualProducto
              fecha_inicio={dateRange.startDate}
              fecha_fin={dateRange.endDate}
            />
          </CardContent>
        </Card>

        {/* Métricas */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-warning">Pico Máximo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-warning">
                {metricas.picoMaximo
                  ? formatNumber(metricas.picoMaximo.valor)
                  : "-"}
              </p>
              <p className="text-sm text-muted-foreground">
                {metricas.picoMaximo
                  ? `${metricas.picoMaximo.mes} ${metricas.picoMaximo.anio}`
                  : "Mes con más eventos"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">Tendencia</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-xl font-bold ${
                  metricas.tendencia
                    ? getTendenciaColor(metricas.tendencia.direccion)
                    : "text-success"
                }`}
              >
                {metricas.tendencia
                  ? `${getTendenciaIcono(metricas.tendencia.direccion)} ${
                      metricas.tendencia.crecimiento
                    }%`
                  : "-"}
              </p>
              <p className="text-sm text-muted-foreground">
                {metricas.tendencia
                  ? `Crecimiento ${metricas.tendencia.direccion}`
                  : "Crecimiento anual"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-info">
                {metricas.promedio ? formatNumber(metricas.promedio) : "-"}
              </p>
              <p className="text-sm text-muted-foreground">Eventos por mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-danger">Variabilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-danger">
                {metricas.variabilidad
                  ? formatNumber(metricas.variabilidad)
                  : "-"}
              </p>
              <p className="text-sm text-muted-foreground">
                Desviación estándar
              </p>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataAnual || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasAnual}
              searchPlaceHolder="Buscar año..."
              title="Resumen Anual"
              subtitle="Datos consolidados de asistencia humanitaria por año"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlAnual}
              filters={filtersAnual}
              setFilters={setFiltersAnual}
              handleImprimir={handleImprimirPDFAnual}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="overflow-x-auto w-full">
            <DataTable
              data={
                dataMensual || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasMensual}
              searchPlaceHolder="Buscar mes..."
              title="Detalle Mensual"
              subtitle="Datos detallados de asistencia humanitaria por mes"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlMensual}
              filters={filtersMensual}
              setFilters={setFiltersMensual}
              handleImprimir={handleImprimirPDFMensual}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
