import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCell } from "./formatCell";

export function generateTablePDF({
  columns,
  data,
  title = "Reporte",
}: {
  columns: any[];
  data: any[];
  title?: string;
}) {
  const doc = new jsPDF({ orientation: "landscape", format: "legal" });
  doc.setFontSize(16);
  doc.text(title, 14, 18);

  const tableColumns = columns.map((col) => col.label);
  // Formatear fechas en formato dd/mm/yyyy si la columna es tipo date
  const formatDate = (value: string) => {
    if (!value) return "";
    // Si el valor es tipo 'YYYY-MM-DD'
    const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})/.exec(value);
    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }
    // Si no, usa el Date normal
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // Usar formatCell para cada celda
  // Importar la función
  // import { formatCell } from './formatCell';
  const tableRows = data.map((row) =>
    columns.map((col) => formatCell(row[col.key], col.dataType))
  );

  // @ts-ignore
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 24,
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [255, 172, 88], // #ffac58 en formato RGB
      textColor: 20,
      fontStyle: "bold",
    },
  });

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
}
