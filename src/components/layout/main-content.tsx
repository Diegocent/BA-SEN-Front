import { motion } from "framer-motion";
import { ResumenGeneral } from "../sections/ResumenGeneral/resumen-general";
import { AnalisisGeografico } from "../sections/AnalisisGeografico/analisis-geografico";
import { AnalisisTemporal } from "../sections/AnalisisTemporal/analisis-temporal";
import { AnalisisEventos } from "../sections/AnalisisEventos/analisis-eventos";

interface MainContentProps {
  activeSection: string;
  isSidebarCollapsed: boolean;
}

const sectionComponents = {
  resumen: ResumenGeneral,
  geografico: AnalisisGeografico,
  temporal: AnalisisTemporal,
  eventos: AnalisisEventos,
};

export function MainContent({
  activeSection,
  isSidebarCollapsed,
}: MainContentProps) {
  const SectionComponent =
    sectionComponents[activeSection as keyof typeof sectionComponents] ||
    ResumenGeneral;

  // Calcular el margen izquierdo basado en el estado del sidebar
  const marginLeft = isSidebarCollapsed ? "80px" : "280px";

  return (
    <motion.div
      key={activeSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-background transition-all duration-300 ease-in-out"
      style={{ marginLeft }} // Aplicar margen dinámico
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <SectionComponent />
        </div>
      </div>
    </motion.div>
  );
}
