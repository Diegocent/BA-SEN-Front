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
import GraficoTotalAyudasPorDepartamento from "./grafico-total-ayudas-departamento";
import GraficoTopLocalidades from "./grafico-top-localidades";
import GraficoEvolucionAyudasTopDepartamentos from "./grafico-evolucion-ayudas-top-departamentos";
import HeatmapDepartamentoAnio from "./heatmap-departamento-anio";
import { useState } from "react";
export function AnalisisGeografico() {
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
  const queryParamsDepto = { ...filtersDeptoWithoutPage, ...pageParamDepto };

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
      <GraficoTotalAyudasPorDepartamento />
      <GraficoTopLocalidades />
      <GraficoEvolucionAyudasTopDepartamentos />
      <HeatmapDepartamentoAnio />
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
            <CardTitle className="text-primary">Mapa de Distribución</CardTitle>
            <CardDescription>
              Visualización geográfica de la asistencia por departamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Aquí se mostrará el mapa interactivo de Paraguay
              </p>
            </div>
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

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Resumen por Departamento
            </CardTitle>
            <CardDescription>
              Datos consolidados de asistencia humanitaria por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              title={""}
              onViewDetails={() => null}
              itemsPerPage={10}
              onPageChange={setPageUrlDepto}
              filters={filtersDepto}
              setFilters={setFiltersDepto}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-info">Resumen por Distrito</CardTitle>
            <CardDescription>
              Datos detallados de asistencia humanitaria por distrito
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              title={""}
              onViewDetails={() => null}
              itemsPerPage={10}
              onPageChange={setPageUrlDistrito}
              filters={filtersDistrito}
              setFilters={setFiltersDistrito}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
