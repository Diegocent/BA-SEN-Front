import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DataTable } from "../data-table";
import { useGetPorDepartamentoQuery, useGetPorUbicacionQuery } from "@/api";
import GraficoTotalAyudasPorDepartamento from "../grafico-total-ayudas-departamento";
import GraficoTopLocalidades from "../grafico-top-localidades";
import GraficoEvolucionAyudasTopDepartamentos from "../grafico-evolucion-ayudas-top-departamentos";
import HeatmapDepartamentoAnio from "../heatmap-departamento-anio";
import { useState, useEffect } from "react";
import { generateTablePDF } from "@/lib/pdfUtils";
import { ObtenerTotalData } from "@/hooks/obtenerTotalData";
export function AnalisisGeografico() {
  // Filtro global de fechas
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: "", endDate: "" });

  // Estado para filtros y página para departamentos
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
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParamsDepto = {
    ...filtersDeptoWithoutPage,
    ...pageParamDepto,
    ...dateParams,
  };

  // Estado para filtros y página para distritos
  const [filtersDistrito, setFiltersDistrito] = useState<Record<string, any>>(
    {}
  );
  const [pageUrlDistrito, setPageUrlDistrito] = useState<string | null>(null);
  const { page: pageDistrito, ...filtersDistritoWithoutPage } = filtersDistrito;
  const pageParamDistrito = pageUrlDistrito
    ? {
        page: pageUrlDistrito.includes("page=")
          ? pageUrlDistrito.split("page=").pop()
          : "1",
      }
    : { page: "1" };
  const queryParamsDistrito = {
    ...filtersDistritoWithoutPage,
    ...pageParamDistrito,
    ...dateParams,
  };
  // PDF params y handlers para DEPARTAMENTOS
  const [pdfParamDepto, setPdfParamDepto] = useState({});
  useEffect(() => {
    setPdfParamDepto({ ...filtersDeptoWithoutPage, ...dateParams });
  }, [filtersDepto, dateRange]);

  const handleImprimirPDFDepto = async () => {
    const registrosTotales = await ObtenerTotalData(
      "",
      "por-departamento",
      pdfParamDepto,
      dataDepartamento?.count || 10
    );
    generateTablePDF({
      columns: columnasDepartamentos,
      data: registrosTotales?.results || [],
      title: "Resumen por Departamento",
    });
  };

  // PDF params y handlers para DISTRITOS
  const [pdfParamDistrito, setPdfParamDistrito] = useState({});
  useEffect(() => {
    setPdfParamDistrito({ ...filtersDistritoWithoutPage, ...dateParams });
  }, [filtersDistrito, dateRange]);

  const handleImprimirPDFDistrito = async () => {
    const registrosTotales = await ObtenerTotalData(
      "",
      "por-ubicacion",
      pdfParamDistrito,
      dataDistrito?.count || 10
    );
    generateTablePDF({
      columns: columnasDistritos,
      data: registrosTotales?.results || [],
      title: "Resumen por Distrito",
    });
  };
  const columnasDepartamentos = [
    { key: "departamento", label: "Departamento" },
    { key: "kit_sentencia", label: "Kits Sentencia" },
    { key: "kit_evento", label: "Kits de asistencia por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];

  const columnasDistritos = [
    { key: "departamento", label: "Departamento" },
    { key: "distrito", label: "Distrito" },
    { key: "kit_sentencia", label: "Kits Sentencia" },
    { key: "kit_evento", label: "Kits de asistencia por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];
  // Paginación para distritos
  const {
    data: dataDistrito,
    error: errorDistrito,
    isLoading: isLoadingDistrito,
  } = useGetPorUbicacionQuery(queryParamsDistrito) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para departamentos
  const {
    data: dataDepartamento,
    error: errorDepartamento,
    isLoading: isLoadingDepartamento,
  } = useGetPorDepartamentoQuery(queryParamsDepto) as {
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
          Análisis Geográfico
        </h1>
        <p className="text-muted-foreground">
          Distribución geográfica de la asistencia humanitaria
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
              Total de asistencias por departamento
            </CardTitle>
            <CardDescription>
              Este grafico muestra la cantidad de productos entregados por
              departamento en el rango de tiempo seleccionado
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
              <GraficoTotalAyudasPorDepartamento
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </motion.div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">
                Localidades con mas eventos registrados
              </CardTitle>
              <CardDescription>
                Grafico que indica la cantidad de eventos registrados en cada
                localidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoTopLocalidades
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">
                Evolucion de asistencias por año
              </CardTitle>
              <CardDescription>
                Grafico que muestra los 5 departamentos mas asistidos por cada
                año
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoEvolucionAyudasTopDepartamentos
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-success">
              Mapa de calor de departamentos por año
            </CardTitle>
            <CardDescription>
              Mapa que muestra la cantidad de asistencias segun año y
              departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapDepartamentoAnio
              fecha_inicio={dateRange.startDate}
              fecha_fin={dateRange.endDate}
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-warning">
                Departamentos Atendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-warning">0</p>
              <p className="text-sm text-muted-foreground">
                De 17 departamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">Distritos Cubiertos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-info">0</p>
              <p className="text-sm text-muted-foreground">
                Distritos con asistencia
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">Cobertura Rural</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">0%</p>
              <p className="text-sm text-muted-foreground">
                Áreas rurales atendidas
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
                dataDepartamento || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasDepartamentos}
              searchPlaceHolder="Buscar departamento..."
              title="Resumen por Departamento"
              subtitle="Datos consolidados de asistencia humanitaria por departamento"
              onViewDetails={() => null}
              itemsPerPage={10}
              onPageChange={setPageUrlDepto}
              filters={filtersDepto}
              setFilters={setFiltersDepto}
              handleImprimir={handleImprimirPDFDepto}
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
                dataDistrito || {
                  results: [],
                  page: 1,
                  page_size: 10,
                  total_pages: 1,
                  total: 0,
                }
              }
              columns={columnasDistritos}
              searchPlaceHolder="Buscar distrito..."
              title="Resumen por Distrito"
              subtitle="Datos detallados de asistencia humanitaria por distrito"
              onViewDetails={() => null}
              itemsPerPage={10}
              onPageChange={setPageUrlDistrito}
              filters={filtersDistrito}
              setFilters={setFiltersDistrito}
              handleImprimir={handleImprimirPDFDistrito}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
