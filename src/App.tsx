"use client"

import { useState } from "react"
import { Sidebar } from "./components/sidebar"
import { MainContent } from "./components/main-content"

function App() {
  const [activeSection, setActiveSection] = useState("resumen")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <MainContent activeSection={activeSection} />
    </div>
  )
}

export default App
