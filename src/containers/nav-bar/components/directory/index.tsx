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
import { renameDir, addDir, removeDir, selectSearchTerm } from "#containers/nav-bar/nav-bar.slice"
import { addFileContent, addShowedTab, renameTab, saveActiveTabId, selectFileById, selectShowedTabById } from "#containers/edit-pane/edit-pane.slice"
import { InitContent } from "#containers/edit-pane/components/editor/editor.config"

export const Directory = ({ data }: { data: IDirectory }) => {
  const dispatch = useAppDispatch()
  const searchTerm = useAppSelector(selectSearchTerm)
  const fileContent = useAppSelector(state => selectFileById(state, data.id)) 
  const showedTab = useAppSelector(state => selectShowedTabById(state, data.id))
  const isFolderType = data.type === DirType.FOLDER
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const defaultAddState = { isEditing: false, isFolder: false }
  const [addState, setAddState] = useState<{ isEditing: boolean, isFolder: boolean }>(defaultAddState)
  
  useEffect(() => {
    if (searchTerm) {
      setIsOpen(!data.name.includes(searchTerm))
    }
  }, [searchTerm])

  const handleClick = () => {
    if (isFolderType) {
      setIsOpen(!isOpen)
    } else {
      if (fileContent) {
        if (!showedTab) {
          dispatch(addShowedTab({ id: data.id, name: data.name }))
        }
      } else {
        dispatch(addFileContent({
          id: data.id, 
          content: InitContent[data.type as keyof typeof InitContent]
        }))
        dispatch(addShowedTab({ id: data.id, name: data.name }))
      }
      dispatch(saveActiveTabId(data.id))
    }
  }

  const handleRename = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setIsRenaming(true)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const renameInfo = { id: data.id, newName: e.currentTarget.value }
      dispatch(renameDir(renameInfo))
      if (!isFolderType) dispatch(renameTab(renameInfo))
      setIsRenaming(false)
    }
  }

  const handleAdd = (e: React.MouseEvent<HTMLElement>, isFolder: boolean) => {
    e.stopPropagation()
    setAddState({ isEditing: true, isFolder })
  }

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isFolder: boolean) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const newDirName = e.currentTarget.value
      let newDir: IDirectory = {
        id: new Date().toISOString(),
        name: newDirName,
        type: DirType.FOLDER,
        children: []
      } 

      if (!isFolder) {
        const fileType = getFileType(newDirName)
        newDir = { ...newDir, type: fileType }
        dispatch(addFileContent({
          id: newDir.id, 
          content: InitContent[fileType as keyof typeof InitContent]
        }))
        dispatch(addShowedTab({ id: newDir.id, name: newDir.name }))
        dispatch(saveActiveTabId(newDir.id))
      } 

      dispatch(addDir({ parentId: data.id, newDir }))
      setAddState(defaultAddState)
      if (!isOpen) setIsOpen(true)
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    dispatch(removeDir(data.id))
  }

  return (
    <>
      <div className="navbar-item" onClick={handleClick}>
        <span className="navbar-item-icon">
          {isFolderType
            ? isOpen ? <RiFolderOpenFill /> : <MdFolder />
            : <MdInsertDriveFile />
          }
        </span>
        {isRenaming
          ? <input 
              autoFocus
              className="navbar-input-text" 
              defaultValue={data.name}
              type="text"
              onBlur={() => setIsRenaming(false)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => handleRenameKeyDown(e)}
            />
          : <span className="navbar-item-text">
              {data.name}
            </span>
        }
        {isRenaming || 
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
            {data.id === "0" ||
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
              onBlur={() => setAddState(defaultAddState)}
              onKeyDown={(e) => handleAddKeyDown(e, addState.isFolder)}
            />
          </div>
        }
        {isOpen &&
          data.children.map((child: IDirectory) => (
            <Directory data={child} key={child.id} />
          ))
        }
      </div>
    </>
  )
}