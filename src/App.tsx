import { useState } from "react";
import { Sidebar } from "./components/layout/sidebar";
import { MainContent } from "./components/layout/main-content";

function App() {
  const [activeSection, setActiveSection] = useState("resumen");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="bg-background">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onToggleCollapse={setIsSidebarCollapsed}
      />
      <MainContent
        activeSection={activeSection}
        isSidebarCollapsed={isSidebarCollapsed}
      />
    </div>
  );
}

export default App;
