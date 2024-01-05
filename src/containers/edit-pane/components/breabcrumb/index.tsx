import { useEffect, useState } from "react"
import { useAppSelector } from "#app/hooks"
import { selectDirData } from "#containers/nav-bar/nav-bar.slice"
import { getNodeById } from "#utils/tree"

export const Breadcrumb = ({ tabId }: { tabId: string }) => {
  const dirData = useAppSelector(selectDirData)
  const [filePath, setFilePath] = useState<string>("")

  useEffect(() => {
    const node = getNodeById(dirData, tabId)
    if (node) setFilePath(node.path)
  }, [dirData, tabId])

  return (
    <div className="breadcrumb-container">
      {filePath.replace(/\//g, " > ")}
    </div>
  )
}
