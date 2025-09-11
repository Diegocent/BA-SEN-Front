import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DataTable } from "../data-table";
import { useGetAnualQuery, useGetMensualQuery } from "@/api";
import { useState } from "react";
export function AnalisisTemporal() {
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
  const queryParamsAnual = { ...filtersAnualWithoutPage, ...pageParamAnual };

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
  };

  const columnasAnual = [
    { key: "anio", label: "Año" },
    { key: "kit_sentencia", label: "Kits por sentencia de la corte" },
    { key: "kit_evento", label: "Kits de asistencia por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];

  const columnasMensual = [
    { key: "anio", label: "Año" },
    { key: "nombre_mes", label: "Mes" },
    { key: "kit_sentencia", label: "Kits por sentencia de la corte" },
    { key: "kit_evento", label: "Kits de asistencia por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];

  // Paginación para anual
  const {
    data: dataAnual,
    error: errorAnual,
    isLoading: isLoadingAnual,
  } = useGetAnualQuery(queryParamsAnual) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para mensual
  const {
    data: dataMensual,
    error: errorMensual,
    isLoading: isLoadingMensual,
  } = useGetMensualQuery(queryParamsMensual) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
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
            <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Aquí se mostrará el gráfico de tendencias temporales
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Análisis por Año</CardTitle>
              <CardDescription>Distribución anual de eventos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico anual</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">Análisis por Mes</CardTitle>
              <CardDescription>Patrones estacionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico mensual</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-warning">Pico Máximo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-warning">-</p>
              <p className="text-sm text-muted-foreground">
                Mes con más eventos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">Tendencia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-success">-</p>
              <p className="text-sm text-muted-foreground">Crecimiento anual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-info">-</p>
              <p className="text-sm text-muted-foreground">Eventos por mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-danger">Variabilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-danger">-</p>
              <p className="text-sm text-muted-foreground">
                Desviación estándar
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Resumen Anual</CardTitle>
            <CardDescription>
              Datos consolidados de asistencia humanitaria por año
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              title={""}
              onViewDetails={() => null}
              itemsPerPage={10}
              onPageChange={setPageUrlAnual}
              filters={filtersAnual}
              setFilters={setFiltersAnual}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-info">Detalle Mensual</CardTitle>
            <CardDescription>
              Datos detallados de asistencia humanitaria por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              title={""}
              onViewDetails={() => null}
              itemsPerPage={10}
              onPageChange={setPageUrlMensual}
              filters={filtersMensual}
              setFilters={setFiltersMensual}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
