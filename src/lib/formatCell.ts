import { data } from "framer-motion/client";

export const formatCell = (value: any, dataType?: string) => {
  // Si es null/undefined, mostrar vacío
  if (value === null || value === undefined) return "";

  // Separador de miles para números o strings numéricos de 4+ dígitos
  if (
    dataType === "number" &&
    ((typeof value === "number" && Math.abs(value) >= 1000) ||
      (typeof value === "string" && /^-?\d{4,}$/.test(value)))
  ) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Formateo de fechas
  if (
    (dataType === "date" ||
      (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))) &&
    value
  ) {
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

  // Por defecto, mostrar el valor tal cual
  return value;
};
