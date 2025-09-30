import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Map,
  Clock,
  AlertTriangle,
  Mail,
  Github,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "../../lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onToggleCollapse?: (isCollapsed: boolean) => void;
}

const navigationItems = [
  {
    id: "resumen",
    label: "Resumen General",
    icon: BarChart3,
    color: "text-primary",
  },
  {
    id: "geografico",
    label: "Análisis Geográfico",
    icon: Map,
    color: "text-info",
  },
  {
    id: "temporal",
    label: "Análisis Temporal",
    icon: Clock,
    color: "text-warning",
  },
  {
    id: "eventos",
    label: "Análisis por Eventos",
    icon: AlertTriangle,
    color: "text-danger",
  },
];

const contactItems = [
  {
    id: "email",
    label: "Contacto",
    value: "diegovillalbacent1234@gmail.com",
    icon: Mail,
    href: "mailto:diegovillalbacent1234@gmail.com",
  },
  {
    id: "github",
    label: "Repositorio GitHub",
    value: "github.com/Diegocent/dashboardTesisDjango",
    icon: Github,
    href: "https://github.com/Diegocent/dashboardTesisDjango",
  },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  onToggleCollapse,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse?.(newState);
  };
  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <h1 className="text-lg font-bold text-sidebar-foreground leading-tight">
                  BA - Asistencia Humanitaria
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Datos de la SEN Paraguay
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-12 text-left",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                    isCollapsed && "justify-center px-0"
                  )}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary-foreground" : item.color,
                      !isCollapsed && "mr-3"
                    )}
                  />

                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        variants={contentVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          {contactItems.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 text-left text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                    isCollapsed && "justify-center px-0"
                  )}
                  asChild
                >
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />

                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.div
                          variants={contentVariants}
                          initial="collapsed"
                          animate="expanded"
                          exit="collapsed"
                          transition={{ duration: 0.2 }}
                          className="flex flex-col min-w-0 overflow-hidden"
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.div
                                  variants={contentVariants}
                                  initial="collapsed"
                                  animate="expanded"
                                  exit="collapsed"
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col min-w-0" // min-w-0 para permitir el truncado
                                >
                                  <span className="text-xs font-medium truncate">
                                    {item.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    {item.value}
                                  </span>
                                </motion.div>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <div className="flex flex-col max-w-xs">
                                  <span className="font-medium">
                                    {item.label}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {item.value}
                                  </span>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
