import "./nav-bar.style.scss"
import React, { useEffect } from "react"
import { SlClose } from "react-icons/sl";
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { SearchBox } from "./components/search-box"
import { Directory } from "./components/directory"
import { saveOpenedMenuId, saveWarningMsg, selectDirData, selectWarningMsg } from "./nav-bar.slice"

export const NavBar: React.FC = () => {
  const dispatch = useAppDispatch()
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
      {dirData.isVisible 
        ? <Directory parent={undefined} dirData={dirData} />
        : <div className="navbar-hint"> No results found. </div>
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