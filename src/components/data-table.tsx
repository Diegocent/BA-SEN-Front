"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface DataTablePaginated {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

interface DataTableProps {
  title: string;
  data: any[] | DataTablePaginated;
  columns: Column[];
  onViewDetails: (item: any) => React.ReactNode;
  itemsPerPage?: number;
  searchPlaceHolder?: string;
  onPageChange?: (url: string | null) => void;
}

export function DataTable({
  title,
  data,
  columns,
  onViewDetails,
  itemsPerPage = 10,
  searchPlaceHolder = "Buscar...",
  onPageChange,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Determinar si los datos están paginados
  const isPaginated = !Array.isArray(data);

  // Si data es paginada, usar results, de lo contrario usar el array completo
  const rawData = isPaginated ? data?.results ?? [] : data;

  // Filtrar datos para búsqueda (solo para datos no paginados)
  const filteredData = useMemo(() => {
    if (isPaginated || !searchTerm) return rawData;
    return rawData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rawData, searchTerm, isPaginated]);

  // Cálculos de paginación
  const totalCount = isPaginated ? data.count : filteredData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Calcular el rango de registros mostrados
  const startItem = isPaginated
    ? (currentPage - 1) * itemsPerPage + 1
    : (currentPage - 1) * itemsPerPage + 1;

  const endItem = isPaginated
    ? Math.min(currentPage * itemsPerPage, totalCount)
    : Math.min(currentPage * itemsPerPage, totalCount);

  // Obtener datos para mostrar en la tabla
  const paginatedData = isPaginated
    ? rawData // Los datos ya vienen paginados del servidor
    : filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // Manejar cambio de página para datos paginados del servidor
  const handleServerPageChange = (
    url: string | null,
    direction: "next" | "prev"
  ) => {
    if (onPageChange && url) {
      onPageChange(url);
      setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
    }
  };

  // Manejar cambio de página para datos locales
  const handleLocalPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-primary">{title}</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={searchPlaceHolder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.label}</TableHead>
                ))}
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="text-center py-8"
                  >
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key}>{item[column.key]}</TableCell>
                    ))}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startItem} a {endItem} de {totalCount} registros
          </p>
          <div className="flex items-center space-x-2">
            {isPaginated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleServerPageChange(data.previous, "prev")}
                  disabled={!data.previous}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleServerPageChange(data.next, "next")}
                  disabled={!data.next}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              totalPages > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLocalPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLocalPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )
            )}
          </div>
        </div>

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto z-[100]">
            <DialogHeader>
              <DialogTitle>Detalles del Registro</DialogTitle>
            </DialogHeader>
            {selectedItem && onViewDetails(selectedItem)}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
