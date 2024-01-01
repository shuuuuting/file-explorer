import { useAppSelector } from "../../app/hooks"
import { Directory } from "./components/directory"
import { selectDirectoryData, selectSearchTerm, selectShowedDirectoryData } from "./components/directory/directory.slice"
import { Searchbox } from "./components/searchbox"
import "./sidebar.style.scss"
import React from "react"

export const Sidebar: React.FC = () => {
  const searchTerm = useAppSelector(selectSearchTerm)
  const showedFolderData = useAppSelector(selectShowedDirectoryData)
  const folderData = useAppSelector(selectDirectoryData)

  return (
    <div className="sidebar-container">
      <div className="sidebar-title"> EXPLORER </div>
      {/* search section */}
      <Searchbox />
      {/* folders tree */}
      {searchTerm 
        ? showedFolderData 
          ? <Directory data={showedFolderData} />
          : <div className="sidebar-hint"> No results found. </div>
        : <Directory data={folderData} />
      }
    </div>
  )
}