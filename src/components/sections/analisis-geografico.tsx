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

export function AnalisisGeografico() {
  const resumenDepartamentos = [
    {
      departamento: "Central",
      kit_sentencia: 40,
      kit_evento: 120,
      chapas: 300,
    },
    {
      departamento: "Alto Paraná",
      kit_sentencia: 25,
      kit_evento: 80,
      chapas: 150,
    },
    {
      departamento: "Itapúa",
      kit_sentencia: 18,
      kit_evento: 60,
      chapas: 90,
    },
    {
      departamento: "Caaguazú",
      kit_sentencia: 10,
      kit_evento: 35,
      chapas: 60,
    },
    {
      departamento: "San Pedro",
      kit_sentencia: 8,
      kit_evento: 22,
      chapas: 35,
    },
  ];

  const resumenDistritos = [
    {
      departamento: "Central",
      distrito: "Asunción",
      kit_sentencia: 12,
      kit_evento: 30,
      chapas: 60,
    },
    {
      departamento: "Alto Paraná",
      distrito: "Ciudad del Este",
      kit_sentencia: 8,
      kit_evento: 22,
      chapas: 35,
    },
    {
      departamento: "Itapúa",
      distrito: "Encarnación",
      kit_sentencia: 5,
      kit_evento: 15,
      chapas: 20,
    },
    {
      departamento: "Caaguazú",
      distrito: "Coronel Oviedo",
      kit_sentencia: 4,
      kit_evento: 10,
      chapas: 12,
    },
    {
      departamento: "San Pedro",
      distrito: "San Pedro del Ycuamandiyú",
      kit_sentencia: 3,
      kit_evento: 8,
      chapas: 10,
    },
  ];

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
              data={resumenDepartamentos}
              columns={columnasDepartamentos}
              searchPlaceHolder="Buscar departamento..."
              title={""}
              onViewDetails={function (item: any): React.ReactNode {
                throw new Error("Function not implemented.");
              }}
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
              data={resumenDistritos}
              columns={columnasDistritos}
              searchPlaceHolder="Buscar distrito..."
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
