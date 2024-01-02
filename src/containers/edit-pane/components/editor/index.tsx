import React, { useEffect, useState } from "react"
import { Editor as MonacoEditor } from "@monaco-editor/react"
import { InitContent, LanguageMap } from "./editor.config"
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { selectActiveTabId, selectFileById, selectShowedTabById, updateFileContent } from "#containers/edit-pane/edit-pane.slice"
import { getFileType } from "#containers/nav-bar/components/directory/directory.utils"

export const Editor: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeTabId = useAppSelector(selectActiveTabId)
  const showedTab = useAppSelector(state => selectShowedTabById(state, activeTabId!))
  const savedContent = useAppSelector(state => selectFileById(state, activeTabId!))?.content 
  const fileType = getFileType(showedTab?.name ?? "") as keyof typeof InitContent
  const [currContent, setCurrContent] = useState<string | undefined>(savedContent ?? InitContent[fileType]) 
  
  useEffect(() => {
    if (savedContent !== currContent) {
      setCurrContent(savedContent)
    } 
  }, [savedContent])

  const handleChange = (value: string | undefined) => {
    setCurrContent(value)
  }

  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault()
      console.log("onSave")
      dispatch(updateFileContent({ id: activeTabId, content: currContent }))
    }
  })

  return (
    <div className="editpane-editor"> 
      <MonacoEditor
        theme="vs-dark"
        language={LanguageMap[fileType]}
        value={currContent}
        onChange={handleChange}
      />
    </div>
  )
}
