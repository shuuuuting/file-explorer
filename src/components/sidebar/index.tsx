import { useAppSelector } from "../../app/hooks"
import { Directory } from "./components/directory"
import { selectDirectoryData } from "./components/directory/directory.slice"
import "./sidebar.style.scss"
import React from "react"

export const Sidebar: React.FC = () => {
  const folderData = useAppSelector(selectDirectoryData)

  return (
    <div className="sidebar-container">
      <div className="sidebar-title"> EXPLORER </div>
      {/* search section */}
      {/* folders tree */}
      <Directory data={folderData} />
    </div>
  )
}