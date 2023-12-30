import React from "react"
import { Sidebar } from "./components/sidebar"
import { Editor } from "./components/editor"

const App: React.FC = () => {
  return (
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar />
      <Editor />
    </div>
  )
}

export default App
