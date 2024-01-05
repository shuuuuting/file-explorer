import React from "react"
import { NavBar } from "./components/nav-bar"
import { EditPane } from "./components/edit-pane"

const App: React.FC = () => {
  return (
    <div className="app-container" style={{ display: "flex" }}>
      <NavBar />
      <EditPane />
    </div>
  )
}

export default App
