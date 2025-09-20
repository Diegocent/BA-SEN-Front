"use client";

import { useState, useEffect, useRef } from "react";
import { useResumenPorDepartamentoQuery } from "../api";
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
  cantidad_registros: number;
  total_kits: number;
  total_chapas: number;
  evento_mas_frecuente: string;
}

interface MapaParaguayProps {
  className?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export function MapaParaguay({
  className,
  fecha_inicio,
  fecha_fin,
}: MapaParaguayProps) {
  // Estado para el departamento seleccionado (solo info geográfica)
  const [selectedDepartamento, setSelectedDepartamento] =
    useState<DepartamentoData | null>(null);
  // Estado para los datos a mostrar en el dialog (info de base de datos)
  const [selectedDepartamentoData, setSelectedDepartamentoData] = useState<
    any | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  // Datos mock base con lat/lng/zoom
  const departamentosMock: DepartamentoData[] = [
    {
      departamento: "CAPITAL",
      lat: -25.2967,
      lng: -57.6359,
      zoom: 12,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CENTRAL",
      lat: -25.3637,
      lng: -57.4259,
      zoom: 10,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ALTO PARANÁ",
      lat: -25.5163,
      lng: -54.6436,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ITAPÚA",
      lat: -26.8753,
      lng: -55.9178,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CAAGUAZÚ",
      lat: -25.4669,
      lng: -56.0175,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "SAN PEDRO",
      lat: -24.0669,
      lng: -57.0789,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CORDILLERA",
      lat: -25.3219,
      lng: -56.8467,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "GUAIRÁ",
      lat: -25.7833,
      lng: -56.45,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CAAZAPÁ",
      lat: -26.1978,
      lng: -56.3711,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "MISIONES",
      lat: -26.8833,
      lng: -57.0833,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "PARAGUARÍ",
      lat: -25.6319,
      lng: -57.1456,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ALTO PARAGUAY",
      lat: -20.3167,
      lng: -58.1833,
      zoom: 8,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "PDTE. HAYES",
      lat: -23.35,
      lng: -59.05,
      zoom: 8,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "BOQUERON",
      lat: -22.6833,
      lng: -60.4167,
      zoom: 8,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "AMAMBAY",
      lat: -22.5667,
      lng: -56.0333,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CANINDEYÚ",
      lat: -24.1167,
      lng: -55.1667,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "CONCEPCIÓN",
      lat: -23.4167,
      lng: -57.4333,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
    {
      departamento: "ÑEEMBUCÚ",
      lat: -26.9167,
      lng: -58.2833,
      zoom: 9,
      cantidad_registros: 0,
      total_kits: 0,
      total_chapas: 0,
      evento_mas_frecuente: "",
    },
  ];

  // Obtener datos reales del backend
  const {
    data: resumenData,
    isLoading,
    error,
  } = useResumenPorDepartamentoQuery({
    fecha_desde: fecha_inicio,
    fecha_hasta: fecha_fin,
  });

  // Merge: para cada departamento mock, si hay datos reales, los sobreescribe
  const departamentosData: DepartamentoData[] = departamentosMock.map(
    (mock) => {
      const real = resumenData?.find(
        (d: any) =>
          (d.departamento || d.nombre || d.name)?.toUpperCase() ===
          mock.departamento.toUpperCase()
      );
      return real
        ? {
            ...mock,
            cantidad_registros: real.cantidad_registros ?? 0,
            total_kits: real.total_kits ?? 0,
            total_chapas: real.total_chapas ?? 0,
            evento_mas_frecuente: real.evento_mas_frecuente ?? "",
          }
        : mock;
    }
  );

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
          // Buscar los datos en la consulta según el nombre del departamento
          const real = resumenData?.find(
            (d: any) =>
              (d.departamento || d.nombre || d.name)?.toUpperCase() ===
              dept.departamento.toUpperCase()
          );
          setSelectedDepartamentoData(real || null);
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
  }, [resumenData]);

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
                    {selectedDepartamentoData?.cantidad_registros ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Registros
                  </p>
                </div>
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <p className="text-sm font-bold text-success">
                    {selectedDepartamentoData?.evento_mas_frecuente || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Evento más frecuente
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Total Chapas:</span>
                  <span className="text-sm font-bold text-primary">
                    {selectedDepartamentoData?.total_chapas ?? 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-secondary-light rounded">
                  <span className="text-sm font-medium">Total Kits:</span>
                  <span className="text-sm font-bold text-warning">
                    {selectedDepartamentoData?.total_kits ?? 0}
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
