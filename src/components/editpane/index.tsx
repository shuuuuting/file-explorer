import "./editpane.style.scss"
import React from "react"
import { Editor } from "@monaco-editor/react"
import { InitContent } from "./editpane.config"
import { Tab } from "./components/tab"

export const Editpane: React.FC = () => {
  const handleChange = (value: string | undefined) => {
    console.log(value)
  }

  return (
    <div className="editpane-container">
      {/* tabs */}
      <Tab />
      {/* breadcrumb */}
      {/* file content */}
      <div className="editpane-editor"> 
        <Editor
          language="json"
          theme="vs-dark"
          value={InitContent.JSON}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
