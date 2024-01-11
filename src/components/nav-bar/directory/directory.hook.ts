import { IDirectory } from "./directory.interface"
import { DirType } from "./directory.config"
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { getFileType } from "./directory.helper"
import { renameDir, addDir, removeDir, selectOpenedMenuId, saveOpenedMenuId, saveExpandedDir } from "#components/nav-bar/nav-bar.slice"
import { addFileContent, addTab, removeFileContent, renameTab, saveActiveTabId, selectFileById, selectShowedTabById } from "#components/edit-pane/edit-pane.slice"
import { InitContent } from "#components/edit-pane/editor/editor.config"
import { v4 as uuidv4 } from "uuid"

export const useEventHandler = ({ parent, dirData }: { parent: IDirectory | undefined, dirData: IDirectory }) => {
  const dispatch = useAppDispatch()
  const fileContent = useAppSelector(state => selectFileById(state, dirData.id)) 
  const showedTab = useAppSelector(state => selectShowedTabById(state, dirData.id))
  const isFolderType = dirData.type === DirType.FOLDER
  const { isExpanded } = dirData
  const isMenuShow = useAppSelector(selectOpenedMenuId) === dirData.id
  const defaultAddState = { isEditing: false, isFolder: false }

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

  const handleRename = (e: React.MouseEvent<HTMLElement>, setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.stopPropagation()
    setIsRenaming(true)
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, setIsNameInvalid: React.Dispatch<React.SetStateAction<boolean>>, setIsRenaming: React.Dispatch<React.SetStateAction<boolean>>) => {
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

  const handleAdd = (e: React.MouseEvent<HTMLElement>, isFolder: boolean, setAddState: React.Dispatch<React.SetStateAction<any>>) => {
    e.stopPropagation()
    setAddState({ isEditing: true, isFolder })
  }

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, isFolder: boolean, setIsNameInvalid: React.Dispatch<React.SetStateAction<boolean>>, setAddState: React.Dispatch<React.SetStateAction<any>>) => {
    const newName = e.currentTarget.value
    if (e.key === "Enter" && e.currentTarget.value) {
      if (dirData.children.map(child => child.name).includes(newName)) {
        setIsNameInvalid(true)
      } else {
        setIsNameInvalid(false)
        let newDir: IDirectory = {
          id: uuidv4(),
          name: newName,
          path: `${dirData.path}/${newName}`,
          type: DirType.FOLDER,
          isExpanded: false,
          isVisible: true,
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

  return { 
    handleClick, handleRightClick, 
    handleRename, handleRenameKeyDown, 
    handleAdd, handleAddKeyDown, handleRemove  
  }
}