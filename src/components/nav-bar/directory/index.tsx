import { IDirectory } from "./directory.interface"
import { MdFolder } from "react-icons/md"
import { RiFolderOpenFill } from "react-icons/ri"
import { MdInsertDriveFile } from "react-icons/md"
import { FiEdit2 } from "react-icons/fi"
import { FiFolderPlus } from "react-icons/fi"
import { FiFilePlus } from "react-icons/fi"
import { FiTrash } from "react-icons/fi"
import { DirType } from "./directory.config"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { selectSearchTerm, selectOpenedMenuId, saveExpandedDir, selectCachedDirInfo } from "#components/nav-bar/nav-bar.slice"
import { selectActiveTabId } from "#components/edit-pane/edit-pane.slice"
import { ButtonAction, ContextMenu } from "../context-menu"
import { useEventHandler } from "./directory.hook"

export const Directory = ({ parent, dirData }: { parent: IDirectory | undefined, dirData: IDirectory }) => {
  const dispatch = useAppDispatch()
  const activeTabId = useAppSelector(selectActiveTabId)
  const searchTerm = useAppSelector(selectSearchTerm)
  const isSearching = searchTerm.length > 0
  const cachedDirInfo = useAppSelector(selectCachedDirInfo)
  const isCutting = cachedDirInfo?.action === ButtonAction.CUT && cachedDirInfo.dirData.id === dirData.id
  const isFolderType = dirData.type === DirType.FOLDER
  const { isExpanded, isVisible } = dirData
  const isMenuShow = useAppSelector(selectOpenedMenuId) === dirData.id
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const [isNameInvalid, setIsNameInvalid] = useState(false)
  const defaultAddState = { isEditing: false, isFolder: false }
  const [addState, setAddState] = useState<{ isEditing: boolean, isFolder: boolean }>(defaultAddState)
  
  const { handleClick, handleRightClick, handleRename, handleRenameKeyDown,
          handleAdd, handleAddKeyDown, handleRemove } = useEventHandler( {parent, dirData })

  useEffect(() => {
    if (searchTerm) {
      dispatch(saveExpandedDir({ 
        id: dirData.id, 
        key: "isExpanded", 
        newData: !dirData.name.includes(searchTerm)
      }))
    }
  }, [searchTerm])

  return (
    <>
      <div 
        className={"navbar-item"
          + `${activeTabId === dirData.id ? " selected" : ""}`
          + `${isMenuShow ? " rightClicked" : ""}`
          + `${isCutting ? " cut" : ""}`
          + `${!isVisible ? " invisible" : ""}`
        } 
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        {isMenuShow && !isSearching && !isRenaming && !isCutting &&
          <div 
            className="context-menu-container"
            style={{ visibility: isMenuShow ? "visible" : "hidden" }}
          > 
            <ContextMenu dirData={dirData}/>
          </div>
        }
        {isNameInvalid && 
          <span 
            className="invalid-warning"
            style={{ display: isNameInvalid ? "flex" : "none" }}
          >
            The name already exists at this location! 
          </span> 
        }
        <span className="navbar-item-icon">
          {isFolderType
            ? isExpanded ? <RiFolderOpenFill /> : <MdFolder />
            : <MdInsertDriveFile />
          }
        </span>
        {isRenaming
          ? <input 
              autoFocus
              className="navbar-input-text" 
              defaultValue={dirData.name}
              type="text"
              onBlur={() => {setIsRenaming(false); setIsNameInvalid(false)}}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => handleRenameKeyDown(e, setIsNameInvalid, setIsRenaming)}
            />
          : <span className="navbar-item-text">
              {dirData.name}
            </span>
        }
        {isSearching || isRenaming || isCutting || isMenuShow ||
          <span className="navbar-item-action">
            <span 
              className="navbar-item-button"
              onClick={(e) => handleRename(e, setIsRenaming)}
            >
              <FiEdit2 />
            </span>
            {isFolderType &&
              <>
                <span
                  className="navbar-item-button"
                  onClick={(e) => handleAdd(e, true, setAddState)}
                >
                  <FiFolderPlus />
                </span>
                <span
                  className="navbar-item-button"
                  onClick={(e) => handleAdd(e, false, setAddState)}
                >
                  <FiFilePlus />
                </span>
              </>
            }
            {dirData.id === "0" ||
              <span 
                className="navbar-item-button"
                onClick={handleRemove}
              >
                <FiTrash />
              </span>
            }
          </span>
        }
      </div>
      <div className="navbar-indent">
        {addState.isEditing &&
          <div className="navbar-input" >
            <span className="navbar-input-icon">
              {addState.isFolder ? <MdFolder /> : <MdInsertDriveFile />}
            </span>
            <input 
              autoFocus
              className="navbar-input-text" 
              type="text"
              onBlur={() => {setAddState(defaultAddState); setIsNameInvalid(false)}}
              onKeyDown={(e) => handleAddKeyDown(e, addState.isFolder, setIsNameInvalid, setAddState)}
            />
          </div>
        }
        {isExpanded &&
          dirData.children.map((child: IDirectory) => (
            <Directory parent={dirData} dirData={child} key={child.id} />
          ))
        }
      </div>
    </>
  )
}