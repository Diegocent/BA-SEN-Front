"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function AnalisisGeografico() {
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
      </motion.div>
    </motion.div>
  );
}
