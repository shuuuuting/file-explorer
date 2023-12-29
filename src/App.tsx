import React from "react"
import { Sidebar } from "./components"
import { Editor } from "./components/editor"

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <Editor />
    </div>
  )
}

export default App
