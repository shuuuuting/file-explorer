import React from "react"
import { NavBar } from "./containers/nav-bar"
import { EditPane } from "./containers/edit-pane"

const App: React.FC = () => {
  return (
    <div className="app-container" style={{ display: "flex" }}>
      <NavBar />
      <EditPane />
    </div>
  )
}

export default App
