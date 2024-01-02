import "./nav-bar.style.scss"
import React from "react"
import { useAppSelector } from "../../app/hooks"
import { Directory } from "./components/directory"
import { SearchBox } from "./components/search-box"
import { selectDirData, selectSearchTerm, selectShowedDirData } from "./nav-bar.slice"

export const NavBar: React.FC = () => {
  const searchTerm = useAppSelector(selectSearchTerm)
  const showedDirData = useAppSelector(selectShowedDirData)
  const dirData = useAppSelector(selectDirData)

  return (
    <div className="navbar-container">
      <div className="navbar-title"> EXPLORER </div>
      {/* search section */}
      <SearchBox />
      {/* folders tree */}
      {searchTerm 
        ? showedDirData 
          ? <Directory dirData={showedDirData} />
          : <div className="navbar-hint"> No results found. </div>
        : <Directory dirData={dirData} />
      }
    </div>
  )
}