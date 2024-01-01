import { IDirectory } from "./directory.type"
import { MdFolder } from "react-icons/md"
import { RiFolderOpenFill } from "react-icons/ri"
import { MdInsertDriveFile } from "react-icons/md"
import { FiEdit2 } from "react-icons/fi"
import { FiFolderPlus } from "react-icons/fi"
import { FiFilePlus } from "react-icons/fi"
import { FiTrash } from "react-icons/fi"
import { DirType } from "./directory.config"
import { useState } from "react"
import { useAppDispatch } from "#app/hooks"
import { addDir, removeDir, renameDir } from "./directory.slice"
import { getFileType } from "./directory.utils"

export const Directory = ({ data }: { data: IDirectory }) => {
  const dispatch = useAppDispatch()
  const isFolderType = data.type === DirType.FOLDER
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isRenaming, setIsRenaming] = useState<boolean>(false)
  const [addState, setAddState] = useState<{ isEditing: boolean, isFolder: boolean }>({
    isEditing: false, isFolder: false
  })

  const handleRename = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setIsRenaming(true)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value) {
      const newDirName = e.currentTarget.value
      dispatch(renameDir({ id: data.id, newDirName }))
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
        newDir = { ...newDir, type: getFileType(newDirName) }
      } 

      dispatch(addDir({ parentId: data.id, newDir }))
      setAddState({ isEditing: false, isFolder: false })
      if (!isOpen) setIsOpen(true)
    }
  }

  const handleRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    dispatch(removeDir(data.id))
  }

  return (
    <>
      <div className="sidebar-item" onClick={() => setIsOpen(!isOpen)}>
        <span className="sidebar-item-icon">
          {isFolderType
            ? isOpen ? <RiFolderOpenFill /> : <MdFolder />
            : <MdInsertDriveFile />
          }
        </span>
        {isRenaming
          ? <input 
              autoFocus
              className="sidebar-input-text" 
              defaultValue={data.name}
              type="text"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => handleRenameKeyDown(e)}
            />
          : <span className="sidebar-item-text">
              {data.name}
            </span>
        }
        {isRenaming || 
          <span className="sidebar-item-action">
            <span 
              className="sidebar-item-button"
              onClick={handleRename}
            >
              <FiEdit2 />
            </span>
            {isFolderType &&
              <>
                <span
                  className="sidebar-item-button"
                  onClick={(e) => handleAdd(e, true)}
                >
                  <FiFolderPlus />
                </span>
                <span
                  className="sidebar-item-button"
                  onClick={(e) => handleAdd(e, false)}
                >
                  <FiFilePlus />
                </span>
              </>
            }
            {data.id === "0" ||
              <span 
                className="sidebar-item-button"
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
          <div className="sidebar-input" >
            <span className="sidebar-input-icon">
              {addState.isFolder ? <MdFolder /> : <MdInsertDriveFile />}
            </span>
            <input 
              autoFocus
              className="sidebar-input-text" 
              type="text"
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