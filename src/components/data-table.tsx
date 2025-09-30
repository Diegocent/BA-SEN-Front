"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button as MuiButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  Box,
  Typography,
  Card as MuiCard,
  CardContent as MuiCardContent,
} from "@mui/material";
import {
  Visibility,
  ChevronLeft,
  ChevronRight,
  Search,
  FilterList,
  Print,
  Close,
} from "@mui/icons-material";
import { formatCell } from "@/lib/formatCell";
import { FileText, Filter } from "lucide-react";

export type Column = {
  key: string;
  label: string;
  dataType?: "text" | "number" | "date";
  filterType?: "text" | "select" | "date";
  selectOptions?: string[];
  maxWidth?: number;
};

export interface DataTableProps {
  title: string;
  subtitle?: string;
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
  handleImprimir?: () => void;
  maxHeight?: string;
}

export function DataTable(props: DataTableProps) {
  const {
    title,
    subtitle,
    data,
    columns,
    onViewDetails,
    itemsPerPage = 10,
    searchPlaceHolder = "Buscar...",
    onPageChange,
    filters,
    setFilters,
    handleImprimir,
    maxHeight = "70vh",
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);
  const [textFilterValue, setTextFilterValue] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Datos paginados
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

  const handleAddFilter = (colKey: string, value: any) => {
    const col = columns.find((c) => c.key === colKey);
    let cleanValue = value;
    if (col && col.dataType === "number" && typeof value === "string") {
      cleanValue = value.replace(/\./g, "");
    }
    setCurrentPage(1);
    setFilters({ ...filters, [colKey]: cleanValue });
    setShowFilterPanel(false);
    setActiveFilterCol(null);
    setTextFilterValue("");
    if (onPageChange) {
      onPageChange("?page=1");
    }
  };

  const handleRemoveFilter = (colKey: string) => {
    const newFilters = { ...filters };
    if (colKey === "fecha_desde" || colKey === "fecha_hasta") {
      delete newFilters["fecha_desde"];
      delete newFilters["fecha_hasta"];
      setDateFrom("");
      setDateTo("");
    } else {
      delete newFilters[colKey];
    }
    setFilters(newFilters);
  };

  return (
    <MuiCard
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight,
        width: "100%",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        backgroundColor: "hsl(var(--card))",
      }}
    >
      <MuiCardContent
        sx={{ flexShrink: 0, borderBottom: 1, borderColor: "divider" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "var(--primary)",
                fontWeight: "bold",
                fontSize: "1rem",
                lineHeight: "1.25rem",
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                sx={{
                  color: "hsl(var(--muted-foreground))",
                  mt: 0.5,
                  fontSize: "0.875rem",
                  lineHeight: "1.25rem",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilterPanel((v) => !v)}
              title="Filtrar"
            >
              <Filter className="h-5 w-5" />
            </Button>
            {handleImprimir && (
              <Button
                variant="primary"
                size="default"
                onClick={handleImprimir}
                className="ml-2 bg-primary hover:bg-primary-dark"
                title="Imprimir PDF"
              >
                <FileText />
                <span className="text-white font-semibold">Imprimir PDF</span>
              </Button>
            )}
          </Box>
        </Box>

        {showFilterPanel && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Selecciona columna</InputLabel>
              <Select
                value={activeFilterCol || ""}
                label="Selecciona columna"
                onChange={(e) => setActiveFilterCol(e.target.value)}
              >
                <MenuItem value="">Selecciona columna</MenuItem>
                {columns.map((col) => (
                  <MenuItem key={col.key} value={col.key}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {activeFilterCol &&
              (() => {
                const col = columns.find((c) => c.key === activeFilterCol);
                if (!col) return null;

                if (col.filterType === "text") {
                  return (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField
                        size="small"
                        placeholder={`Filtrar ${col.label}`}
                        value={textFilterValue}
                        onChange={(e) => setTextFilterValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleAddFilter(col.key, textFilterValue);
                        }}
                        autoFocus
                      />
                      <IconButton
                        sx={{ color: "hsl(var(--primary))" }}
                        onClick={() =>
                          handleAddFilter(col.key, textFilterValue)
                        }
                        size="small"
                      >
                        <Search />
                      </IconButton>
                    </Box>
                  );
                }

                if (col.filterType === "select") {
                  return (
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>{col.label}</InputLabel>
                      <Select
                        value={filters[col.key] || ""}
                        label={col.label}
                        onChange={(e) =>
                          handleAddFilter(col.key, e.target.value)
                        }
                      >
                        <MenuItem value="">Todos</MenuItem>
                        {(col.selectOptions || []).map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                if (col.filterType === "date") {
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(
                    today.getMonth() + 1
                  ).padStart(2, "0")}-${String(today.getDate()).padStart(
                    2,
                    "0"
                  )}`;

                  const handleBuscar = () => {
                    const from = dateFrom || todayStr;
                    const to = dateTo || todayStr;
                    setDateFrom(from);
                    setDateTo(to);
                    setCurrentPage(1);
                    setFilters({
                      ...filters,
                      fecha_desde: from,
                      fecha_hasta: to,
                    });
                    setShowFilterPanel(false);
                    setActiveFilterCol(null);
                    if (onPageChange) onPageChange("?page=1");
                  };

                  return (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField
                        type="date"
                        size="small"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <Typography>a</Typography>
                      <TextField
                        type="date"
                        size="small"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                      <IconButton
                        sx={{ color: "hsl(var(--primary))" }}
                        onClick={handleBuscar}
                        size="small"
                      >
                        <Search />
                      </IconButton>
                    </Box>
                  );
                }

                return null;
              })()}
          </Box>
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {filters.fecha_desde && filters.fecha_hasta && (
            <Chip
              label={`Fecha: ${formatCell(
                filters.fecha_desde,
                "date"
              )} a ${formatCell(filters.fecha_hasta, "date")}`}
              onDelete={() => {
                handleRemoveFilter("fecha_desde");
                handleRemoveFilter("fecha_hasta");
              }}
              sx={{
                backgroundColor: "hsl(var(--primary) / 0.1)",
                color: "hsl(var(--primary))",
                borderColor: "hsl(var(--primary))",
              }}
              variant="outlined"
              size="small"
            />
          )}
          {Object.entries(filters)
            .filter(([k]) => k !== "fecha_desde" && k !== "fecha_hasta")
            .map(([k, v]) => {
              const col = columns.find((c) => c.key === k);
              if (!col) return null;
              return (
                <Chip
                  key={k}
                  label={`${col.label}: ${v}`}
                  onDelete={() => handleRemoveFilter(k)}
                  sx={{
                    backgroundColor: "hsl(var(--primary) / 0.1)",
                    color: "hsl(var(--primary))",
                    borderColor: "hsl(var(--primary))",
                  }}
                  variant="outlined"
                  size="small"
                />
              );
            })}
        </Box>
      </MuiCardContent>

      <TableContainer sx={{ flexGrow: 1, overflow: "auto", maxWidth: "100%" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "white",
                    color: "hsl(var(--foreground))",
                    ...(column.maxWidth && {
                      maxWidth: column.maxWidth,
                      minWidth: column.maxWidth,
                      width: column.maxWidth,
                    }),
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "white",
                  color: "hsl(var(--foreground))",
                  width: 100,
                  minWidth: 100,
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    No se encontraron registros
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "hsl(var(--muted) / 0.5)",
                    },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      sx={{
                        ...(column.maxWidth && {
                          maxWidth: column.maxWidth,
                          minWidth: column.maxWidth,
                          width: column.maxWidth,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }),
                      }}
                    >
                      {formatCell(item[column.key], column.dataType)}
                    </TableCell>
                  ))}
                  <TableCell sx={{ width: 100, minWidth: 100 }}>
                    <IconButton
                      size="small"
                      sx={{ color: "hsl(var(--primary))" }}
                      onClick={() => handleViewDetails(item)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: "divider", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "hsl(var(--muted-foreground))" }}
          >
            Mostrando {startItem} a {endItem} de {totalCount} registros
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {isPaginated && (
              <>
                <MuiButton
                  variant="outlined"
                  size="small"
                  startIcon={<ChevronLeft />}
                  onClick={() => handleServerPageChange(data.previous, "prev")}
                  disabled={!data.previous}
                  sx={{
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    "&:hover": {
                      borderColor: "hsl(var(--primary))",
                      backgroundColor: "hsl(var(--muted) / 0.5)",
                    },
                  }}
                >
                  Anterior
                </MuiButton>
                <Typography variant="body2">
                  Página {currentPage} de {totalPages}
                </Typography>
                <MuiButton
                  variant="outlined"
                  size="small"
                  endIcon={<ChevronRight />}
                  onClick={() => handleServerPageChange(data.next, "next")}
                  disabled={!data.next}
                  sx={{
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                    "&:hover": {
                      borderColor: "hsl(var(--primary))",
                      backgroundColor: "hsl(var(--muted) / 0.5)",
                    },
                  }}
                >
                  Siguiente
                </MuiButton>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Dialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Detalles del Registro
          <IconButton onClick={() => setIsDetailOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && onViewDetails(selectedItem)}
        </DialogContent>
      </Dialog>
    </MuiCard>
  );
}
