"use client";

// Tipos para columnas y props de DataTable
export type Column = {
  key: string;
  label: string;
  dataType?: "text" | "number" | "date";
  filterType?: "text" | "select" | "date";
  selectOptions?: string[];
};

export interface DataTableProps {
  title: string;
  data:
    | any[]
    | {
        count: number;
        next: string | null;
        previous: string | null;
        results: any[];
      };
  columns: Column[];
  onViewDetails: (item: any) => React.ReactNode;
  itemsPerPage?: number;
  searchPlaceHolder?: string;
  onPageChange?: (url: string) => void;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
}

import type React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./ui/table";

export function DataTable(props: DataTableProps) {
  const {
    title,
    data,
    columns,
    onViewDetails,
    itemsPerPage = 10,
    searchPlaceHolder = "Buscar...",
    onPageChange,
    filters,
    setFilters,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);

  // ✅ Estado único para el valor del filtro de texto
  const [textFilterValue, setTextFilterValue] = useState("");

  // Solo datos paginados, nunca filtrado local
  const isPaginated = !Array.isArray(data);
  const rawData = isPaginated ? data?.results ?? [] : data;
  const totalCount = isPaginated ? data.count : rawData.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);
  const paginatedData = rawData;

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleServerPageChange = (
    url: string | null,
    direction: "next" | "prev"
  ) => {
    if (onPageChange && url) {
      onPageChange(url);
      setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
    }
  };

  // Filtros: chips y panel
  const handleAddFilter = (colKey: string, value: any) => {
    setFilters({ ...filters, [colKey]: value });
    setShowFilterPanel(false);
    setActiveFilterCol(null);
    setTextFilterValue(""); // reset al aplicar
  };

  const handleRemoveFilter = (colKey: string) => {
    const newFilters = { ...filters };
    delete newFilters[colKey];
    setFilters(newFilters);
  };

  // Formateo de celdas según dataType
  const formatCell = (value: any, dataType?: string) => {
    if (dataType === "number" && typeof value === "number") {
      return value.toLocaleString("es-ES");
    }
    if (dataType === "date" && value) {
      // Si ya viene como string YYYY-MM-DD, mostramos directo
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-");
        return `${day}/${month}/${year}`;
      }

      // Si es Date u otro formato válido, fallback a toLocaleDateString
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("es-ES");
      }
    }

    return value;
  };

  const [dateFilterValue, setDateFilterValue] = useState<String | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-primary">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {/* Icono de filtro */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilterPanel((v) => !v)}
              title="Filtrar"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Panel de filtros y chips en un solo contenedor */}
        <div>
          {showFilterPanel && (
            <div className="flex flex-wrap gap-4 mt-4">
              <select
                className="border rounded px-2 py-1"
                value={activeFilterCol || ""}
                onChange={(e) => setActiveFilterCol(e.target.value)}
              >
                <option value="">Selecciona columna</option>
                {columns.map((col: Column) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>
              {activeFilterCol &&
                (() => {
                  const col = columns.find(
                    (c: Column) => c.key === activeFilterCol
                  );
                  if (!col) return null;

                  if (col.filterType === "text") {
                    const handleKeyDown = (
                      e: React.KeyboardEvent<HTMLInputElement>
                    ) => {
                      if (e.key === "Enter") {
                        handleAddFilter(col.key, textFilterValue);
                      }
                    };
                    const handleBuscar = () => {
                      handleAddFilter(col.key, textFilterValue);
                    };
                    return (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="text"
                          placeholder={`Filtrar ${col.label}`}
                          value={textFilterValue}
                          onChange={(e) => setTextFilterValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleBuscar}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  }

                  if (col.filterType === "select") {
                    return (
                      <select
                        className="border rounded px-2 py-1"
                        value={filters[col.key] || ""}
                        onChange={(e) =>
                          handleAddFilter(col.key, e.target.value)
                        }
                      >
                        <option value="">Todos</option>
                        {(col.selectOptions || []).map((opt: string) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    );
                  }

                  if (col.filterType === "date") {
                    const handleDateChange = (
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const value = e.target.value; // viene en formato YYYY-MM-DD
                      if (value) {
                        setDateFilterValue(value); // convertimos a Date
                      }
                    };

                    return (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="date"
                          value={
                            dateFilterValue
                              ? dateFilterValue.toString().slice(0, 10)
                              : ""
                          }
                          onChange={handleDateChange}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (dateFilterValue) {
                              handleAddFilter(col.key, dateFilterValue);
                            }
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  }

                  return null;
                })()}
            </div>
          )}
          {/* Chips de filtros activos */}
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(filters).map(([k, v]) => {
              const col = columns.find((c: Column) => c.key === k);
              if (!col) return null;
              return (
                <span
                  key={k}
                  className="flex items-center bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                >
                  {col.label}:{" "}
                  {col.filterType === "date" ? formatCell(v, "date") : v}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1"
                    onClick={() => handleRemoveFilter(k)}
                  >
                    ×
                  </Button>
                </span>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column: Column) => (
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
                paginatedData.map((item: any, index: number) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    {columns.map((column: Column) => (
                      <TableCell key={column.key}>
                        {formatCell(item[column.key], column.dataType)}
                      </TableCell>
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
            ) : null}
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
