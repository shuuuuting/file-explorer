import React from "react"
import { Sidebar } from "./components/sidebar"
import { Editpane } from "./components/editpane"

const App: React.FC = () => {
  return (
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar />
      <Editpane />
    </div>
  )
}

export default App
