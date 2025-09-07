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
import { useState } from "react";

export function AnalisisGeografico() {
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
  const [pageUrlDistrito, setPageUrlDistrito] = useState<string | null>(null);
  const {
    data: dataDistrito,
    error: errorDistrito,
    isLoading: isLoadingDistrito,
  } = useGetPorUbicacionQuery(
    pageUrlDistrito ? { page: pageUrlDistrito.split("=")[1] } : {}
  ) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para departamentos
  const [pageUrlDepartamento, setPageUrlDepartamento] = useState<string | null>(
    null
  );
  const {
    data: dataDepartamento,
    error: errorDepartamento,
    isLoading: isLoadingDepartamento,
  } = useGetPorDepartamentoQuery(
    pageUrlDepartamento ? { page: pageUrlDepartamento.split("=")[1] } : {}
  ) as {
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
              onPageChange={setPageUrlDepartamento}
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
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
