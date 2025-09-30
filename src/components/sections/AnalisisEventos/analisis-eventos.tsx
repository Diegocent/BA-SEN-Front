"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { DataTable } from "../../data-table";
import { useGetPorEventoQuery, useEventosPorDepartamentoQuery } from "@/api";
import { useState, useEffect } from "react";
import { generateTablePDF } from "@/lib/pdfUtils";
import { ObtenerTotalData } from "@/hooks/obtenerTotalData";
import GraficoPieEventos from "../../grafico-pie-eventos";
import GraficoAyudasPorEvento from "../../grafico-ayudas-por-evento";
import GraficoComposicionAyudasPorEvento from "../../grafico-composicion-ayudas-por-evento";
import GraficoComparacionEventosAnio from "../../grafico-comparacion-eventos-anio";
import GraficoTendenciaMensualEventos from "../../grafico-tendencia-mensual-eventos";
import {
  columnasTipoEventos,
  columnasEventosDepartamento,
  columnasTipoEventosPDF,
  columnasEventosDepartamentoPDF,
} from "./constants/constants";
import VisualizarDetallesGenericos from "@/components/VisualizarDetallesGenericos";

export function AnalisisEventos() {
  // Filtro global de fechas
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  // Estado y lógica para filtros y paginación por tipo de evento
  const [filtersEvento, setFiltersEvento] = useState<Record<string, any>>({});
  const [pageUrlEvento, setPageUrlEvento] = useState<string | null>(null);
  const { page: pageEvento, ...filtersEventoWithoutPage } = filtersEvento;
  const pageParamEvento = pageUrlEvento
    ? {
        page: pageUrlEvento.includes("page=")
          ? pageUrlEvento.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParamsEvento = {
    ...filtersEventoWithoutPage,
    ...pageParamEvento,
    ...dateParams,
  };

  // Estado y lógica para filtros y paginación por departamento
  const [filtersDepto, setFiltersDepto] = useState<Record<string, any>>({});
  const [pageUrlDepto, setPageUrlDepto] = useState<string | null>(null);
  const { page: pageDepto, ...filtersDeptoWithoutPage } = filtersDepto;
  const pageParamDepto = pageUrlDepto
    ? {
        page: pageUrlDepto.includes("page=")
          ? pageUrlDepto.split("page=").pop()
          : "1",
      }
    : { page: "1" };

  // PDF params y handlers para EVENTOS
  const [pdfParamEvento, setPdfParamEvento] = useState({});
  useEffect(() => {
    setPdfParamEvento({ ...filtersEventoWithoutPage, ...dateParams });
  }, [filtersEvento, dateRange]);

  const handleImprimirPDFEvento = async () => {
    const registrosTotales = await ObtenerTotalData(
      "",
      "por-evento",
      pdfParamEvento,
      dataEventos?.count || 10
    );
    generateTablePDF({
      columns: columnasTipoEventosPDF,
      data: registrosTotales?.results || [],
      title: "Eventos por Tipo",
    });
  };

  // PDF params y handlers para EVENTOS POR DEPARTAMENTO
  const [pdfParamDepto, setPdfParamDepto] = useState({});
  useEffect(() => {
    setPdfParamDepto({ ...filtersDeptoWithoutPage, ...dateParams });
  }, [filtersDepto, dateRange]);

  const handleImprimirPDFDepto = async () => {
    const registrosTotales = await ObtenerTotalData(
      "",
      "eventos-por-departamento",
      pdfParamDepto,
      dataPorDepartamento?.count || 10
    );
    generateTablePDF({
      columns: columnasEventosDepartamentoPDF,
      data: registrosTotales?.results || [],
      title: "Eventos por Departamento",
    });
  };
  const queryParamsDepto = {
    ...filtersDeptoWithoutPage,
    ...pageParamDepto,
    ...dateParams,
  };

  // Querys
  const { data: dataEventos } = useGetPorEventoQuery(queryParamsEvento) as {
    data: any | undefined;
  };
  const { data: dataPorDepartamento } = useEventosPorDepartamentoQuery(
    queryParamsDepto
  ) as { data: any | undefined };

  const [inundaciones, setInundaciones] = useState(0);
  const [sequias, setSequias] = useState(0);
  const [incendios, setIncendios] = useState(0);
  const [tormentas, setTormentas] = useState(0);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
          Análisis por Eventos
        </h1>
        <p className="text-muted-foreground">
          Análisis categorizado por tipos de eventos de emergencia
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
              Distribución por Tipo de Evento
            </CardTitle>
            <CardDescription>
              Cantidad de eventos registrados por tipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoPieEventos
              fecha_inicio={dateRange.startDate}
              fecha_fin={dateRange.endDate}
              setInundaciones={setInundaciones}
              setSequias={setSequias}
              setIncendios={setIncendios}
              setTormentas={setTormentas}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-info">Inundaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-info">{inundaciones}</p>
              <p className="text-sm text-muted-foreground">
                Eventos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-warning">Sequías</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">{sequias}</p>
              <p className="text-sm text-muted-foreground">
                Eventos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-danger">Incendios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-danger">{incendios}</p>
              <p className="text-sm text-muted-foreground">
                Eventos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">Tormentas Severas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{tormentas}</p>
              <p className="text-sm text-muted-foreground">
                Eventos registrados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Asistencias distribuidas segun Evento
              </CardTitle>
              <CardDescription>
                Este grafico contiene la cantidad de asistencias (kits
                sentencia, kits evento, chapas) distribuidas por tipo de evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoAyudasPorEvento
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">
                Composición de Asistencias segun Evento
              </CardTitle>
              <CardDescription>
                Grafico que muestra los detalles de los productos que se
                distribuyeron para cada evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoComposicionAyudasPorEvento
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Comparacion de eventos por año
              </CardTitle>
              <CardDescription>
                Este grafico contiene la cantidad de eventos registrados por año
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoComparacionEventosAnio
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">
                Tendencia mensual de eventos
              </CardTitle>
              <CardDescription>
                Grafico que muestra la tendencia mensual de eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoTendenciaMensualEventos
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
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
                dataEventos || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasTipoEventos}
              searchPlaceHolder="Buscar tipo de evento..."
              title="Resumen por Tipo de Eventos"
              subtitle="Datos consolidados de asistencia humanitaria por tipo de evento"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlEvento}
              filters={filtersEvento}
              setFilters={setFiltersEvento}
              handleImprimir={handleImprimirPDFEvento}
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
                dataPorDepartamento || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasEventosDepartamento}
              searchPlaceHolder="Buscar departamento..."
              title="Eventos por Departamento"
              subtitle="Distribución de eventos de emergencia por departamento"
              onViewDetails={VisualizarDetallesGenericos}
              itemsPerPage={10}
              onPageChange={setPageUrlDepto}
              filters={filtersDepto}
              setFilters={setFiltersDepto}
              handleImprimir={handleImprimirPDFDepto}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
