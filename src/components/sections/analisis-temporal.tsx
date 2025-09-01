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

export function AnalisisTemporal() {
  const resumenAnual = [
    {
      año: 2024,
      kit_sentencia: 120,
      kit_evento: 320,
      chapas: 800,
    },
    {
      año: 2023,
      kit_sentencia: 110,
      kit_evento: 280,
      chapas: 700,
    },
    {
      año: 2022,
      kit_sentencia: 90,
      kit_evento: 210,
      chapas: 500,
    },
    {
      año: 2021,
      kit_sentencia: 70,
      kit_evento: 160,
      chapas: 400,
    },
  ];

  const detalleMensual = [
    {
      año: 2024,
      mes: "Enero",
      kit_sentencia: 12,
      kit_evento: 30,
      chapas: 60,
    },
    {
      año: 2024,
      mes: "Febrero",
      kit_sentencia: 8,
      kit_evento: 22,
      chapas: 35,
    },
    {
      año: 2024,
      mes: "Marzo",
      kit_sentencia: 5,
      kit_evento: 15,
      chapas: 20,
    },
    {
      año: 2024,
      mes: "Abril",
      kit_sentencia: 4,
      kit_evento: 10,
      chapas: 12,
    },
    {
      año: 2024,
      mes: "Mayo",
      kit_sentencia: 3,
      kit_evento: 8,
      chapas: 10,
    },
  ];

  const columnasAnual = [
    { key: "año", label: "Año" },
    { key: "kit_sentencia", label: "Kits por sentencia de la corte" },
    { key: "kit_evento", label: "Kits de asistencia por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];

  const columnasMensual = [
    { key: "año", label: "Año" },
    { key: "mes", label: "Mes" },
    { key: "kit_sentencia", label: "Kits por sentencia de la corte" },
    { key: "kit_evento", label: "Kits de asistencia por eventos adversos" },
    { key: "chapas", label: "Chapas" },
  ];

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
              data={resumenAnual}
              columns={columnasAnual}
              searchPlaceHolder="Buscar año..."
              title={""}
              onViewDetails={function (item: any): React.ReactNode {
                throw new Error("Function not implemented.");
              }}
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
              data={detalleMensual}
              columns={columnasMensual}
              searchPlaceHolder="Buscar mes..."
              title={""}
              onViewDetails={function (item: any): React.ReactNode {
                throw new Error("Function not implemented.");
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
