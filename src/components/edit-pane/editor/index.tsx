import { useEffect } from "react"
import { Editor as MonacoEditor } from "@monaco-editor/react"
import { InitContent, LanguageMap } from "./editor.config"
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { cacheDraftContent, selectFileById, selectShowedTabById, updateFileContent } from "#components/edit-pane/edit-pane.slice"
import { getFileType } from "#components/nav-bar/directory/directory.helper"
import { debounce } from "#utils/debounce"

export const Editor = ({ tabId }: { tabId: string }) => {
  const dispatch = useAppDispatch()
  const showedTab = useAppSelector(state => selectShowedTabById(state, tabId))
  const draftContent = useAppSelector(state => selectFileById(state, tabId))?.draftContent 
  const fileType = getFileType(showedTab?.name ?? "") as keyof typeof InitContent

  useEffect(() => {
    const handleSaveEvent = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        dispatch(updateFileContent({ id: tabId }))
      }
    }
    document.addEventListener("keydown", handleSaveEvent)
    return () => document.removeEventListener("keydown", handleSaveEvent)
  }, [tabId])

  const handleChange = debounce((value: string | undefined) => {
    if (draftContent !== value) {
      dispatch(cacheDraftContent( { id: tabId, content: value || "" }))
    }
  }, 300)

  return (
    <div className="editpane-editor"> 
      <MonacoEditor
        theme="vs-dark"
        language={LanguageMap[fileType]}
        value={draftContent}
        onChange={handleChange}
      />
    </div>
  )
}
