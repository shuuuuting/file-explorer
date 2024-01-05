import "./edit-pane.style.scss"
import React from "react"
import { TabBar } from "./components/tab-bar"
import { Editor } from "./components/editor"
import { useAppSelector } from "#app/hooks"
import { selectActiveTabId } from "./edit-pane.slice"
import { Breadcrumb } from "./components/breabcrumb"

export const EditPane: React.FC = () => {
  const activeTabId = useAppSelector(selectActiveTabId)
  
  return (
    <div className="editpane-container">
      {/* tabs */}
      <TabBar />
      {/* breadcrumb */}
      {activeTabId && <Breadcrumb tabId={activeTabId} />}
      {/* file content */}
      {activeTabId && <Editor tabId={activeTabId} />}
    </div>
  )
}
