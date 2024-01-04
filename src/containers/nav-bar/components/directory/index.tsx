import { IDirectory } from "./directory.type"
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
import { getFileType } from "./directory.utils"
import { renameDir, addDir, removeDir, selectSearchTerm, selectOpenedMenuId, saveOpenedMenuId, saveExpandedDir, selectCachedDirInfo } from "#containers/nav-bar/nav-bar.slice"
import { addFileContent, addTab, removeFileContent, renameTab, saveActiveTabId, selectActiveTabId, selectFileById, selectShowedTabById } from "#containers/edit-pane/edit-pane.slice"
import { InitContent } from "#containers/edit-pane/components/editor/editor.config"
import { ButtonAction, ContextMenu } from "../context-menu"
import { v4 as uuidv4 } from "uuid"

export const Directory = ({ parent, dirData }: { parent: IDirectory | undefined, dirData: IDirectory }) => {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)
  const fileContent = useAppSelector(state => selectFileById(state, dirData.id)) 
  const cachedDirInfo = useAppSelector(selectCachedDirInfo)
  const isCutting = cachedDirInfo?.action === ButtonAction.CUT && cachedDirInfo.dirData.id === dirData.id
  const activeTabId = useAppSelector(selectActiveTabId)
  const showedTab = useAppSelector(state => selectShowedTabById(state, dirData.id))
  const isFolderType = dirData.type === DirType.FOLDER
  const { isExpanded } = dirData
  const isMenuShow = useAppSelector(selectOpenedMenuId) === dirData.id
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const [isNameInvalid, setIsNameInvalid] = useState(false)
  const defaultAddState = { isEditing: false, isFolder: false }
  const [addState, setAddState] = useState<{ isEditing: boolean, isFolder: boolean }>(defaultAddState)
  
  useEffect(() => {
    if (searchTerm) {
      dispatch(saveExpandedDir({ 
        id: dirData.id, 
        key: "isExpanded", 
        newData: !dirData.name.includes(searchTerm)
      }))
    }
  }, [searchTerm])

  const handleClick = () => {
    if (!isMenuShow) {
      if (isFolderType) {
        dispatch(saveExpandedDir({ 
          id: dirData.id, 
          key: "isExpanded", 
          newData: !isExpanded
        }))
      } else {
        if (fileContent) {
          if (!showedTab) {
            dispatch(addTab({ id: dirData.id, name: dirData.name, isUnsaved: false }))
          }
        } else {
          dispatch(addFileContent({
            id: dirData.id, 
            draftContent: InitContent[dirData.type as keyof typeof InitContent]
          }))
          dispatch(addTab({ id: dirData.id, name: dirData.name, isUnsaved: true }))
        }
        dispatch(saveActiveTabId(dirData.id))
      }
    }
  }

  const handleRightClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    dispatch(saveOpenedMenuId(dirData.id))
  }

  const handleRename = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setIsRenaming(true)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newName = e.currentTarget.value
    if (e.key === "Enter" && newName) {
      if (parent && parent.children.map(child => child.name).includes(newName)) {
        setIsNameInvalid(true)
      } else {
        setIsNameInvalid(false)
        const renameInfo = { id: dirData.id, newName: e.currentTarget.value }
        dispatch(renameDir(renameInfo))
        if (!isFolderType) dispatch(renameTab(renameInfo))
        setIsRenaming(false)
      }
    }
  }

  const handleAdd = (e: React.MouseEvent<HTMLElement>, isFolder: boolean) => {
    e.stopPropagation()
    setAddState({ isEditing: true, isFolder })
  }

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isFolder: boolean) => {
    const newName = e.currentTarget.value
    if (e.key === "Enter" && e.currentTarget.value) {
      if (dirData.children.map(child => child.name).includes(newName)) {
        setIsNameInvalid(true)
      } else {
        setIsNameInvalid(false)
        let newDir: IDirectory = {
          id: uuidv4(),
          name: newName,
          type: DirType.FOLDER,
          isExpanded: false,
          children: []
        } 

        if (!isFolder) {
          const fileType = getFileType(newName)
          newDir = { ...newDir, type: fileType }
          dispatch(addFileContent({
            id: newDir.id, 
            draftContent: InitContent[fileType as keyof typeof InitContent]
          }))
          dispatch(addTab({ id: newDir.id, name: newDir.name, isUnsaved: true }))
          dispatch(saveActiveTabId(newDir.id))
        } 

        dispatch(addDir({ parentId: dirData.id, newDir }))
        setAddState(defaultAddState)
        if (!isExpanded) {
          dispatch(saveExpandedDir({ 
            id: dirData.id, 
            key: "isExpanded", 
            newData: true
          }))
        }
      }
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    dispatch(removeDir(dirData.id))
    dispatch(removeFileContent(dirData.id))
  }

  return (
    <>
      <div 
        className={"navbar-item"
          + `${activeTabId === dirData.id ? " selected" : ""}`
          + `${isMenuShow ? " rightClicked" : ""}`
          + `${isCutting ? " isCutting" : ""}`
        } 
        onClick={handleClick}
        onContextMenu={handleRightClick}
      >
        {isMenuShow && 
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
              onKeyDown={handleRenameKeyDown}
            />
          : <span className="navbar-item-text">
              {dirData.name}
            </span>
        }
        {isRenaming || isCutting || 
          <span className="navbar-item-action">
            <span 
              className="navbar-item-button"
              onClick={handleRename}
            >
              <FiEdit2 />
            </span>
            {isFolderType &&
              <>
                <span
                  className="navbar-item-button"
                  onClick={(e) => handleAdd(e, true)}
                >
                  <FiFolderPlus />
                </span>
                <span
                  className="navbar-item-button"
                  onClick={(e) => handleAdd(e, false)}
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
      <div style={{ paddingLeft: 6 }}>
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
              onKeyDown={(e) => handleAddKeyDown(e, addState.isFolder)}
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