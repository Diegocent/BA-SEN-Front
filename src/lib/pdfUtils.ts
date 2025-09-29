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
      fillColor: [255, 172, 88],
      textColor: 20,
      fontStyle: "bold",
    },
  });

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
}
