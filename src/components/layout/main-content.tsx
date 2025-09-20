"use client";

import { motion } from "framer-motion";
import { ResumenGeneral } from "../sections/resumen-general";
import { AnalisisGeografico } from "../sections/analisis-geografico";
import { AnalisisTemporal } from "../sections/analisis-temporal";
import { AnalisisEventos } from "../sections/analisis-eventos";

interface MainContentProps {
  activeSection: string;
}

const sectionComponents = {
  resumen: ResumenGeneral,
  geografico: AnalisisGeografico,
  temporal: AnalisisTemporal,
  eventos: AnalisisEventos,
};

export function MainContent({ activeSection }: MainContentProps) {
  const SectionComponent =
    sectionComponents[activeSection as keyof typeof sectionComponents] ||
    ResumenGeneral;

  return (
    <motion.div
      key={activeSection}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-6 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <SectionComponent />
      </div>
    </motion.div>
  );
}
