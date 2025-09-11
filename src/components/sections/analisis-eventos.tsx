"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Column, DataTable } from "../data-table";
import { useGetPorEventoQuery, useEventosPorDepartamentoQuery } from "@/api";
import { useState } from "react";

function renderDetallesEvento(item: any) {
  return (
    <div className="space-y-2">
      <div>
        <span className="font-medium">Evento:</span>{" "}
        {item.evento || item.tipoEvento}
      </div>
      <div>
        <span className="font-medium">Departamento:</span> {item.departamento}
      </div>
      <div>
        <span className="font-medium">Kits sentencia:</span>{" "}
        {item.kit_sentencia}
      </div>
      <div>
        <span className="font-medium">Kits evento:</span> {item.kit_evento}
      </div>
      <div>
        <span className="font-medium">Chapas:</span> {item.chapas}
      </div>
      {item.numeroOcurrencias && (
        <div>
          <span className="font-medium">Ocurrencias:</span>{" "}
          {item.numeroOcurrencias}
        </div>
      )}
    </div>
  );
}

export function AnalisisEventos() {
  // Columnas
  const columnasTipoEventos: Column[] = [
    {
      key: "evento",
      label: "Tipo de evento",
      dataType: "text",
      filterType: "text",
    },
    {
      key: "numeroOcurrencias",
      label: "Numero de Ocurrencias",
      dataType: "number",
      filterType: "text",
    },
    {
      key: "kit_sentencia",
      label: "Kit sentencia",
      dataType: "number",
      filterType: "text",
    },
    {
      key: "kit_evento",
      label: "Kit por eventos adversos",
      dataType: "number",
      filterType: "text",
    },
    { key: "chapas", label: "Chapas", dataType: "number", filterType: "text" },
  ];
  const columnasEventosDepartamento: Column[] = [
    {
      key: "departamento",
      label: "Departamento",
      dataType: "text",
      filterType: "text",
    },
    { key: "evento", label: "Evento", dataType: "text", filterType: "text" },
    {
      key: "kit_sentencia",
      label: "Kits sentencia",
      dataType: "number",
      filterType: "text",
    },
    {
      key: "kit_evento",
      label: "Kits por eventos adversos",
      dataType: "number",
      filterType: "text",
    },
    { key: "chapas", label: "Chapas", dataType: "number", filterType: "text" },
  ];

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
  const queryParamsEvento = { ...filtersEventoWithoutPage, ...pageParamEvento };

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
  const queryParamsDepto = { ...filtersDeptoWithoutPage, ...pageParamDepto };

  // Querys
  const { data: dataEventos } = useGetPorEventoQuery(queryParamsEvento) as {
    data: any | undefined;
  };
  const { data: dataPorDepartamento } = useEventosPorDepartamentoQuery(
    queryParamsDepto
  ) as { data: any | undefined };
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
              Clasificación de emergencias atendidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Aquí se mostrará el gráfico de distribución por tipos de eventos
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-info">Inundaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-info">0</p>
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
              <p className="text-2xl font-bold text-warning">0</p>
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
              <p className="text-2xl font-bold text-danger">0</p>
              <p className="text-sm text-muted-foreground">
                Eventos registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">Otros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">0</p>
              <p className="text-sm text-muted-foreground">
                Eventos registrados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Impacto por Evento</CardTitle>
              <CardDescription>
                Beneficiarios por tipo de emergencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de impacto</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-info">Duración Promedio</CardTitle>
              <CardDescription>Tiempo de respuesta por tipo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de duración</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Resumen por Tipo de Eventos
            </CardTitle>
            <CardDescription>
              Datos consolidados de asistencia humanitaria por tipo de evento
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              title={""}
              onViewDetails={renderDetallesEvento}
              itemsPerPage={10}
              onPageChange={setPageUrlEvento}
              filters={filtersEvento}
              setFilters={setFiltersEvento}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-info">
              Eventos por Departamento
            </CardTitle>
            <CardDescription>
              Distribución de eventos de emergencia por departamento
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              title={""}
              onViewDetails={renderDetallesEvento}
              itemsPerPage={10}
              onPageChange={setPageUrlDepto}
              filters={filtersDepto}
              setFilters={setFiltersDepto}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
