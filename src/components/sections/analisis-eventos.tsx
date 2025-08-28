"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function AnalisisEventos() {
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
      </motion.div>
    </motion.div>
  );
}
