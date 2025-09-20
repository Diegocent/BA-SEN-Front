import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Database, Users, MapPin } from "lucide-react";
import { MapaParaguay } from "../mapa-paraguay";
import { Column, DataTable } from "../data-table";
import { useResumenGeneralQuery, useAsistenciaDetalladaQuery } from "../../api";
import { useEffect, useState } from "react";
import { data } from "framer-motion/client";
import GraficoDistribucionAyudasPorAnio from "../grafico-distribucion-ayudas-anio";
import GraficoDistribucionAyudasPorDepartamento from "../grafico-distribucion-ayudas-departamento";
import GraficoPieEventos from "../grafico-pie-eventos";
import GraficoTendenciaMensual from "../grafico-tendencia-mensual";

const columnasRegistros: Column[] = [
  { key: "fecha", label: "Fecha", dataType: "date", filterType: "date" },
  {
    key: "localidad",
    label: "Localidad",
    dataType: "text",
    filterType: "text",
  },
  { key: "distrito", label: "Distrito", dataType: "text", filterType: "text" },
  {
    key: "departamento",
    label: "Departamento",
    dataType: "text",
    filterType: "text",
  },
  { key: "evento", label: "Evento", dataType: "text", filterType: "text" },
  {
    key: "kit_sentencia",
    label: "Kit de sentencia de la Corte",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "kit_evento",
    label: "Kit de asistencia por evento adverso",
    dataType: "number",
    filterType: "text",
  },
  {
    key: "chapa_fibrocemento_cantidad",
    label: "Chapas",
    dataType: "number",
    filterType: "text",
  },
];

type ResumenGeneralData = {
  cantidad_departamentos: number;
  cantidad_kit_evento: number;
  cantidad_registros_total: number;
};

export function ResumenGeneral() {
  // Estado para filtros, página y fechas globales
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: "",
    endDate: "",
  });

  // Construir parámetros para la consulta, incluyendo el rango de fechas
  const { page, ...filtersWithoutPage } = filters;
  const pageParam = pageUrl
    ? { page: pageUrl.includes("page=") ? pageUrl.split("page=").pop() : "1" }
    : { page: "1" };
  const dateParams =
    dateRange.startDate && dateRange.endDate
      ? { fecha_desde: dateRange.startDate, fecha_hasta: dateRange.endDate }
      : {};
  const queryParams = { ...filtersWithoutPage, ...pageParam, ...dateParams };

  // Consulta con filtros y página y fechas
  const {
    data: registrosRecientes,
    error: errorAsistencia,
    isLoading: isLoadingAsistencia,
  } = useAsistenciaDetalladaQuery(queryParams) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };
  // Hook de RTK Query para el endpoint resumen-general
  const { data, error, isLoading } = useResumenGeneralQuery(dateParams) as {
    data: ResumenGeneralData | undefined;
    error: any;
    isLoading: boolean;
  };
  const [cardsResumen, setCardsResumen] = useState<ResumenGeneralData>({
    cantidad_departamentos: 0,
    cantidad_kit_evento: 0,
    cantidad_registros_total: 0,
  });

  useEffect(() => {
    if (data) {
      setCardsResumen({
        cantidad_departamentos: data.cantidad_departamentos,
        cantidad_kit_evento: data.cantidad_kit_evento,
        cantidad_registros_total: data.cantidad_registros_total,
      });
    }
  }, [data]);

  // Puedes eliminar registros mock si ya usas la data real
  const renderDetallesRegistro = (registro: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-primary">Información General</h4>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">ID:</span> {registro.id}
            </p>
            <p>
              <span className="font-medium">Fecha:</span> {registro.fecha}
            </p>
            <p>
              <span className="font-medium">Estado:</span> {registro.estado}
            </p>
            <p>
              <span className="font-medium">Responsable:</span>{" "}
              {registro.responsable}
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-primary">Ubicación y Ayuda</h4>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">Departamento:</span>{" "}
              {registro.departamento}
            </p>
            <p>
              <span className="font-medium">Distrito:</span> {registro.distrito}
            </p>
            <p>
              <span className="font-medium">Tipo de Ayuda:</span>{" "}
              {registro.tipoAyuda}
            </p>
            <p>
              <span className="font-medium">Beneficiarios:</span>{" "}
              {registro.beneficiarios}
            </p>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-primary">Detalles Adicionales</h4>
        <div className="mt-2 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            Registro de asistencia humanitaria realizado en {registro.distrito},{" "}
            {registro.departamento}. Se entregaron {registro.tipoAyuda} a{" "}
            {registro.beneficiarios} beneficiarios bajo la supervisión de{" "}
            {registro.responsable}.
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="space-y-8">
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
            Resumen General
          </h1>
          <p className="text-muted-foreground">
            Vista general de los datos de asistencia humanitaria
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 max-w-screen overflow-x-auto"
          style={{ maxWidth: "100vw" }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Total de datos registrados */}
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white border-2 border-primary-dark text-primary-dark">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Database className="h-8 w-8 text-primary-dark" />
                  <CardTitle className="text-primary-dark">
                    Total de datos registrados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary-dark">
                    {cardsResumen?.cantidad_registros_total || 0}
                  </p>
                  <p className="text-sm text-primary-dark/80">
                    En el rango seleccionado
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total de familias asistidas */}
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white border-2 border-primary-dark text-primary-dark">
                <CardHeader className="flex flex-row items-center gap-3">
                  <Users className="h-8 w-8 text-primary-dark" />
                  <CardTitle className="text-primary-dark">
                    Total de familias asistidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary-dark">
                    {cardsResumen?.cantidad_kit_evento || 0}
                  </p>
                  <p className="text-sm text-primary-dark/80">
                    Familias beneficiadas
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Total de departamentos asistidos */}
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white border-2 border-primary-dark text-primary-dark">
                <CardHeader className="flex flex-row items-center gap-3">
                  <MapPin className="h-8 w-8 text-primary-dark" />
                  <CardTitle className="text-primary-dark">
                    Total de departamentos asistidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary-dark">
                    {cardsResumen.cantidad_departamentos || 0}
                  </p>
                  <p className="text-sm text-primary-dark/80">
                    Departamentos únicos
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          <MapaParaguay
            fecha_inicio={dateRange.startDate}
            fecha_fin={dateRange.endDate}
          />

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
                <GraficoPieEventos
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
                  Distribución de ayudas por año
                </CardTitle>
                <CardDescription>
                  Grafico que muestra la cantidad de unidades distribuidas por
                  producto y por año
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoDistribucionAyudasPorAnio
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-info">
                  Distribución de ayudas por departamento
                </CardTitle>
                <CardDescription>
                  Grafico que muestra la cantidad de unidades distribuidas por
                  producto y por departamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraficoDistribucionAyudasPorDepartamento
                  fecha_inicio={dateRange.startDate}
                  fecha_fin={dateRange.endDate}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">
                Tendencias Temporales
              </CardTitle>
              <CardDescription>
                Evolución de la asistencia humanitaria a lo largo del tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoTendenciaMensual
                fecha_inicio={dateRange.startDate}
                fecha_fin={dateRange.endDate}
              />
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="overflow-x-auto w-full">
              <DataTable
                title="Registros Recientes"
                data={
                  registrosRecientes || {
                    count: 0,
                    next: null,
                    previous: null,
                    results: [],
                  }
                }
                columns={columnasRegistros}
                onViewDetails={renderDetallesRegistro}
                itemsPerPage={10}
                onPageChange={setPageUrl}
                filters={filters}
                setFilters={setFilters}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
