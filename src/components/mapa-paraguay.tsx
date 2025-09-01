"use client";

import { useState, useEffect, useRef } from "react";
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
}

interface MapaParaguayProps {
  className?: string;
}

export function MapaParaguay({ className }: MapaParaguayProps) {
  const [selectedDepartamento, setSelectedDepartamento] =
    useState<DepartamentoData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Datos mock basados en el código Python - en producción vendrán del backend Django
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
    },
  ];

  useEffect(() => {
    if (!mapRef.current) return;

    // Cargar Leaflet dinámicamente
    const loadLeaflet = async () => {
      // Cargar CSS de Leaflet
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Cargar JS de Leaflet
      if (!(window as any).L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.head.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const L = (window as any).L;

      // Inicializar mapa centrado en Paraguay (igual que el código original)
      const map = L.map(mapRef.current).setView([-23.442503, -58.443832], 6);

      // Agregar capa de mapa
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Crear marcadores para cada departamento
      departamentosData.forEach((dept) => {
        // Crear marcador personalizado con color primary
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: #FF8100;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([dept.lat, dept.lng], {
          icon: customIcon,
        }).addTo(map);

        // Agregar evento de click para mostrar diálogo detallado
        marker.on("click", () => {
          setSelectedDepartamento(dept);
          setIsDialogOpen(true);
          map.setView([dept.lat, dept.lng], dept.zoom);
        });
      });

      mapInstanceRef.current = map;
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
          <div className="h-[500px] w-full rounded-lg overflow-hidden border">
            <div
              ref={mapRef}
              style={{ height: "100%", width: "100%", zIndex: 1 }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md z-[100] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
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
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Kits de Ayuda:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamento.total_kits}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">
                    Chapa Fibrocemento:
                  </span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamento.total_chapa_fibrocemento}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
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
