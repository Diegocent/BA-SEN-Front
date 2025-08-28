"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function ResumenGeneral() {
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
        className="grid gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              Estadísticas Generales
            </CardTitle>
            <CardDescription>
              Resumen de los principales indicadores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Aquí se mostrará el resumen general de todos los datos de
              asistencia humanitaria de la SEN Paraguay. Incluirá métricas
              clave, totales de beneficiarios, y estadísticas principales.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-info">
                Total de Beneficiarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-info">0</p>
              <p className="text-sm text-muted-foreground">
                Personas asistidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-success">Eventos Atendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">0</p>
              <p className="text-sm text-muted-foreground">
                Emergencias gestionadas
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
