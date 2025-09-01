"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface DepartamentoData {
  departamento: string;
  lat: number;
  lng: number;
  zoom: number;
  total_registros: number;
  total_ayudas: number;
  total_kits: number;
  total_chapa_fibrocemento: number;
  total_chapa_zinc: number;
  x: number; // Coordenada X en el SVG
  y: number; // Coordenada Y en el SVG
}

interface MapaParaguayProps {
  className?: string;
}

export function MapaParaguaySVG({ className }: MapaParaguayProps) {
  const [selectedDepartamento, setSelectedDepartamento] =
    useState<DepartamentoData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  // Datos con coordenadas SVG aproximadas para Paraguay
  const departamentosData: DepartamentoData[] = [
    {
      departamento: "CAPITAL",
      lat: -25.2967,
      lng: -57.6359,
      zoom: 12,
      total_registros: 150,
      total_ayudas: 1200,
      total_kits: 80,
      total_chapa_fibrocemento: 45,
      total_chapa_zinc: 35,
      x: 320,
      y: 280,
    },
    {
      departamento: "CENTRAL",
      lat: -25.3637,
      lng: -57.4259,
      zoom: 10,
      total_registros: 320,
      total_ayudas: 2800,
      total_kits: 180,
      total_chapa_fibrocemento: 120,
      total_chapa_zinc: 90,
      x: 340,
      y: 290,
    },
    {
      departamento: "ALTO PARANÁ",
      lat: -25.5163,
      lng: -54.6436,
      zoom: 9,
      total_registros: 280,
      total_ayudas: 2200,
      total_kits: 140,
      total_chapa_fibrocemento: 85,
      total_chapa_zinc: 75,
      x: 450,
      y: 300,
    },
    {
      departamento: "ITAPÚA",
      lat: -26.8753,
      lng: -55.9178,
      zoom: 9,
      total_registros: 190,
      total_ayudas: 1600,
      total_kits: 95,
      total_chapa_fibrocemento: 60,
      total_chapa_zinc: 50,
      x: 400,
      y: 380,
    },
    {
      departamento: "CAAGUAZÚ",
      lat: -25.4669,
      lng: -56.0175,
      zoom: 9,
      total_registros: 220,
      total_ayudas: 1800,
      total_kits: 110,
      total_chapa_fibrocemento: 70,
      total_chapa_zinc: 65,
      x: 380,
      y: 280,
    },
    {
      departamento: "SAN PEDRO",
      lat: -24.0669,
      lng: -57.0789,
      zoom: 9,
      total_registros: 160,
      total_ayudas: 1300,
      total_kits: 85,
      total_chapa_fibrocemento: 55,
      total_chapa_zinc: 45,
      x: 340,
      y: 220,
    },
    {
      departamento: "CORDILLERA",
      lat: -25.3219,
      lng: -56.8467,
      zoom: 9,
      total_registros: 140,
      total_ayudas: 1100,
      total_kits: 70,
      total_chapa_fibrocemento: 40,
      total_chapa_zinc: 35,
      x: 360,
      y: 270,
    },
    {
      departamento: "GUAIRÁ",
      lat: -25.7833,
      lng: -56.45,
      zoom: 9,
      total_registros: 120,
      total_ayudas: 950,
      total_kits: 60,
      total_chapa_fibrocemento: 35,
      total_chapa_zinc: 30,
      x: 370,
      y: 320,
    },
    {
      departamento: "CAAZAPÁ",
      lat: -26.1978,
      lng: -56.3711,
      zoom: 9,
      total_registros: 100,
      total_ayudas: 800,
      total_kits: 50,
      total_chapa_fibrocemento: 30,
      total_chapa_zinc: 25,
      x: 380,
      y: 340,
    },
    {
      departamento: "MISIONES",
      lat: -26.8833,
      lng: -57.0833,
      zoom: 9,
      total_registros: 90,
      total_ayudas: 720,
      total_kits: 45,
      total_chapa_fibrocemento: 25,
      total_chapa_zinc: 20,
      x: 340,
      y: 380,
    },
    {
      departamento: "PARAGUARÍ",
      lat: -25.6319,
      lng: -57.1456,
      zoom: 9,
      total_registros: 130,
      total_ayudas: 1050,
      total_kits: 65,
      total_chapa_fibrocemento: 40,
      total_chapa_zinc: 35,
      x: 340,
      y: 310,
    },
    {
      departamento: "ALTO PARAGUAY",
      lat: -20.3167,
      lng: -58.1833,
      zoom: 8,
      total_registros: 60,
      total_ayudas: 480,
      total_kits: 30,
      total_chapa_fibrocemento: 18,
      total_chapa_zinc: 15,
      x: 280,
      y: 120,
    },
    {
      departamento: "PDTE. HAYES",
      lat: -23.35,
      lng: -59.05,
      zoom: 8,
      total_registros: 80,
      total_ayudas: 640,
      total_kits: 40,
      total_chapa_fibrocemento: 25,
      total_chapa_zinc: 20,
      x: 220,
      y: 200,
    },
    {
      departamento: "BOQUERON",
      lat: -22.6833,
      lng: -60.4167,
      zoom: 8,
      total_registros: 70,
      total_ayudas: 560,
      total_kits: 35,
      total_chapa_fibrocemento: 20,
      total_chapa_zinc: 18,
      x: 180,
      y: 180,
    },
    {
      departamento: "AMAMBAY",
      lat: -22.5667,
      lng: -56.0333,
      zoom: 9,
      total_registros: 110,
      total_ayudas: 880,
      total_kits: 55,
      total_chapa_fibrocemento: 32,
      total_chapa_zinc: 28,
      x: 380,
      y: 170,
    },
    {
      departamento: "CANINDEYÚ",
      lat: -24.1167,
      lng: -55.1667,
      zoom: 9,
      total_registros: 95,
      total_ayudas: 760,
      total_kits: 48,
      total_chapa_fibrocemento: 28,
      total_chapa_zinc: 24,
      x: 420,
      y: 220,
    },
    {
      departamento: "CONCEPCIÓN",
      lat: -23.4167,
      lng: -57.4333,
      zoom: 9,
      total_registros: 105,
      total_ayudas: 840,
      total_kits: 52,
      total_chapa_fibrocemento: 30,
      total_chapa_zinc: 26,
      x: 320,
      y: 190,
    },
    {
      departamento: "ÑEEMBUCÚ",
      lat: -26.9167,
      lng: -58.2833,
      zoom: 9,
      total_registros: 85,
      total_ayudas: 680,
      total_kits: 42,
      total_chapa_fibrocemento: 24,
      total_chapa_zinc: 20,
      x: 300,
      y: 390,
    },
  ];

  const handleMarkerClick = (departamento: DepartamentoData) => {
    setSelectedDepartamento(departamento);
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Mapa de Paraguay - Asistencia Humanitaria
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Haz clic en los marcadores para ver los datos de cada departamento
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full rounded-lg overflow-hidden border bg-slate-50">
            <svg
              viewBox="0 0 500 450"
              className="w-full h-full"
              style={{
                background:
                  "linear-gradient(to bottom, #e0f2fe 0%, #f0f9ff 100%)",
              }}
            >
              {/* Contorno simplificado de Paraguay */}
              <path
                d="M 150 150 L 450 150 L 450 200 L 480 220 L 480 350 L 450 380 L 400 400 L 350 420 L 300 410 L 250 400 L 200 380 L 180 350 L 160 300 L 150 250 Z"
                fill="#f8fafc"
                stroke="#cbd5e1"
                strokeWidth="2"
                opacity="0.8"
              />

              {/* Río Paraguay (línea indicativa) */}
              <path
                d="M 320 150 Q 310 200 300 250 Q 290 300 280 350 Q 270 380 260 400"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />

              {/* Marcadores de departamentos */}
              {departamentosData.map((dept) => (
                <g key={dept.departamento}>
                  <motion.circle
                    cx={dept.x}
                    cy={dept.y}
                    r={hoveredDept === dept.departamento ? 12 : 8}
                    fill="#FF8100"
                    stroke="white"
                    strokeWidth="3"
                    className="cursor-pointer drop-shadow-md"
                    onClick={() => handleMarkerClick(dept)}
                    onMouseEnter={() => setHoveredDept(dept.departamento)}
                    onMouseLeave={() => setHoveredDept(null)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />

                  {/* Tooltip en hover */}
                  {hoveredDept === dept.departamento && (
                    <motion.g
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <rect
                        x={dept.x - 40}
                        y={dept.y - 35}
                        width="80"
                        height="20"
                        fill="rgba(0,0,0,0.8)"
                        rx="4"
                      />
                      <text
                        x={dept.x}
                        y={dept.y - 22}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {dept.departamento}
                      </text>
                    </motion.g>
                  )}
                </g>
              ))}

              {/* Leyenda */}
              <g transform="translate(20, 380)">
                <rect
                  width="120"
                  height="50"
                  fill="rgba(255,255,255,0.9)"
                  stroke="#cbd5e1"
                  rx="4"
                />
                <circle
                  cx="15"
                  cy="20"
                  r="6"
                  fill="#FF8100"
                  stroke="white"
                  strokeWidth="2"
                />
                <text x="30" y="16" fontSize="10" fill="#374151">
                  Departamentos
                </text>
                <text x="30" y="28" fontSize="8" fill="#6b7280">
                  Clic para detalles
                </text>
                <path d="M 15 35 L 25 35" stroke="#3b82f6" strokeWidth="2" />
                <text x="30" y="38" fontSize="8" fill="#6b7280">
                  Río Paraguay
                </text>
              </g>
            </svg>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md z-[100]">
          <DialogHeader>
            <DialogTitle className="text-primary">
              {selectedDepartamento?.departamento}
            </DialogTitle>
            <DialogDescription>
              Datos de asistencia humanitaria del departamento
            </DialogDescription>
          </DialogHeader>

          {selectedDepartamento && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-info/10 rounded-lg">
                  <p className="text-2xl font-bold text-info">
                    {selectedDepartamento.total_registros}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Registros
                  </p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-2xl font-bold text-success">
                    {selectedDepartamento.total_ayudas}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Ayudas</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <span className="text-sm font-medium">Kits de Ayuda:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamento.total_kits}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <span className="text-sm font-medium">
                    Chapa Fibrocemento:
                  </span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamento.total_chapa_fibrocemento}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                  <span className="text-sm font-medium">Chapa Zinc:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamento.total_chapa_zinc}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
