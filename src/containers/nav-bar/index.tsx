import "./nav-bar.style.scss"
import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Directory } from "./components/directory"
import { SearchBox } from "./components/search-box"
import { saveOpenedMenuId, selectDirData, selectSearchTerm, selectShowedDirData } from "./nav-bar.slice"

export const NavBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)
  const showedDirData = useAppSelector(selectShowedDirData)
  const dirData = useAppSelector(selectDirData)

  useEffect(() => {
    const handleClickElsewhere = () => dispatch(saveOpenedMenuId(undefined))
    window.addEventListener("click", handleClickElsewhere)
    return () => removeEventListener("click", handleClickElsewhere)
  }, [])
  
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