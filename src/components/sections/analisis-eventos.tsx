"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DataTable } from "../data-table";
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
  const resumenTipoEventos = [
    {
      tipoEvento: "Inundaciones",
      numeroOcurrencias: 145,
      kit_sentencia: 40,
      kit_evento: 120,
      chapas: 300,
    },
    {
      tipoEvento: "Sequías",
      numeroOcurrencias: 89,
      kit_sentencia: 25,
      kit_evento: 80,
      chapas: 150,
    },
    {
      tipoEvento: "Incendios",
      numeroOcurrencias: 67,
      kit_sentencia: 18,
      kit_evento: 60,
      chapas: 90,
    },
    {
      tipoEvento: "Tormentas Severas",
      numeroOcurrencias: 45,
      kit_sentencia: 10,
      kit_evento: 35,
      chapas: 60,
    },
  ];

  const eventosPorDepartamento = [
    {
      departamento: "Central",
      evento: "Inundación",
      kit_sentencia: 12,
      kit_evento: 30,
      chapas: 60,
    },
    {
      departamento: "Alto Paraná",
      evento: "Sequía",
      kit_sentencia: 8,
      kit_evento: 22,
      chapas: 35,
    },
    {
      departamento: "Itapúa",
      evento: "Incendio",
      kit_sentencia: 5,
      kit_evento: 15,
      chapas: 20,
    },
    {
      departamento: "Caaguazú",
      evento: "Tormenta",
      kit_sentencia: 4,
      kit_evento: 10,
      chapas: 12,
    },
    {
      departamento: "San Pedro",
      evento: "Granizada",
      kit_sentencia: 3,
      kit_evento: 8,
      chapas: 10,
    },
  ];

  const columnasTipoEventos = [
    { key: "evento", label: "Tipo de evento" },
    { key: "numeroOcurrencias", label: "Numero de Ocurrencias" },
    { key: "kit_sentencia", label: "Kit sentencia" },
    { key: "kit_evento", label: "Kit por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];

  const columnasEventosDepartamento = [
    { key: "departamento", label: "Departamento" },
    { key: "evento", label: "Evento" },
    { key: "kit_sentencia", label: "Kits sentencia" },
    { key: "kit_evento", label: "Kits por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];
  // Paginación para eventos
  const [pageUrlEvento, setPageUrlEvento] = useState<string | null>(null);
  const {
    data: dataEventos,
    error: errorEventos,
    isLoading: isLoadingEventos,
  } = useGetPorEventoQuery(
    pageUrlEvento ? { page: pageUrlEvento.split("=")[1] } : {}
  ) as {
    data: any | undefined;
    error: any;
    isLoading: boolean;
  };

  // Paginación para eventos por departamento
  const [pageUrlDepto, setPageUrlDepto] = useState<string | null>(null);
  const {
    data: dataPorDepartamento,
    error: errorDepto,
    isLoading: isLoadingDepto,
  } = useEventosPorDepartamentoQuery(
    pageUrlDepto ? { page: pageUrlDepto.split("=")[1] } : {}
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
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
