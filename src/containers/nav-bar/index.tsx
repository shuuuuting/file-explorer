import "./nav-bar.style.scss"
import React, { useEffect } from "react"
import { SlClose } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { SearchBox } from "./components/search-box"
import { Directory } from "./components/directory"
import { saveOpenedMenuId, saveWarningMsg, selectDirData, selectSearchTerm, selectShowedDirData, selectWarningMsg } from "./nav-bar.slice"

export const NavBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)
  const showedDirData = useAppSelector(selectShowedDirData)
  const dirData = useAppSelector(selectDirData)
  const warningMsg = useAppSelector(selectWarningMsg)

  useEffect(() => {
    const handleClickElsewhere = () => dispatch(saveOpenedMenuId(undefined))
    window.addEventListener("click", handleClickElsewhere)
    return () => removeEventListener("click", handleClickElsewhere)
  }, [])

  const handleClose = () => {
    dispatch(saveWarningMsg(""))
  }
  
  return (
    <div className="navbar-container">
      <div className="navbar-title"> EXPLORER </div>
      {/* search section */}
      <SearchBox />
      {/* folders tree */}
      {searchTerm 
        ? showedDirData 
          ? <Directory parent={undefined} dirData={showedDirData} />
          : <div className="navbar-hint"> No results found. </div>
        : <Directory parent={undefined} dirData={dirData} />
      }
      {/* pop out warning */}
      {warningMsg && 
        <span className="navbar-warning">
          <span 
            className="navbar-warning-button"
            onClick={handleClose}
          >
            <SlClose />
          </span>
          <span className="navbar-warning-text">
            {warningMsg}
          </span>
        </span>
      }
    </div>
  )
}