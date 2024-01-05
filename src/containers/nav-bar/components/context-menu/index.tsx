import { useAppDispatch, useAppSelector } from "#app/hooks"
import { removeFileContent } from "#containers/edit-pane/edit-pane.slice"
import { addDir, removeDir, saveCachedInfo, saveWarningMsg, selectCachedDirInfo } from "#containers/nav-bar/nav-bar.slice"
import { DirType } from "../directory/directory.config"
import { IDirectory } from "../directory/directory.type"
import { traverseAndModifyAll } from "../directory/directory.helper"
import { v4 as uuidv4 } from "uuid"

export const enum ButtonAction {
  CUT = "Cut",
  COPY = "Copy",
  PASTE = "Paste"
}

interface IButton {
  action: ButtonAction,
  onClick: () => void
}

const hasDuplicateName = (children: IDirectory[], dirName: string) => {
  return children.findIndex(child => child.name === dirName) !== -1
}

const getCopyName = (dirName: string, dirType: DirType) => {
  let copyName = `${dirName} copy`
  if (dirType === DirType.FOLDER) {
    return `${dirName} copy`
  }

  const parts = dirName.split(".")
  const extension = parts.length > 1 ? parts.pop() : undefined

  if (extension) {
    copyName = `${parts.join(".")} copy.${extension}`
  } 
  return copyName
}

export const ContextMenu = ({ dirData }: { dirData: IDirectory }) => {
  const dispatch = useAppDispatch()
  const cachedDirInfo = useAppSelector(selectCachedDirInfo)
  const disabled = (action: ButtonAction) => (
    (dirData.id === "0" && [ButtonAction.CUT, ButtonAction.COPY].includes(action))
    || ((!cachedDirInfo || dirData.type !== DirType.FOLDER) && action === ButtonAction.PASTE)
  )

  const handleCut = () => {
    dispatch(saveWarningMsg(""))
    dispatch(saveCachedInfo({ action: ButtonAction.CUT, dirData }))
  }
  
  const handleCopy = () => {
    dispatch(saveWarningMsg(""))
    dispatch(saveCachedInfo({ action: ButtonAction.COPY, dirData }))
  }

  const handlePaste = () => {
    if (cachedDirInfo) {
      const cachedDirData = cachedDirInfo.dirData

      if (cachedDirInfo.action === ButtonAction.CUT) {
        if (hasDuplicateName(dirData.children, cachedDirData.name)) {
          dispatch(saveWarningMsg("Unable to move the file because its name already exists at destination."))
        } else {
          dispatch(removeDir(dirData.id))
          dispatch(removeFileContent(dirData.id))
          dispatch(addDir({ parentId: dirData.id, cachedDirData }))
        }
      } else {
        let newDir = { 
          ...cachedDirData, 
          name: hasDuplicateName(dirData.children, cachedDirData.name) 
                  ? getCopyName(cachedDirData.name, cachedDirData.type) 
                  : cachedDirData.name
        }
        newDir = traverseAndModifyAll(newDir, "id", () => uuidv4())
        dispatch(addDir({ parentId: dirData.id, newDir }))
      }
      dispatch(saveCachedInfo(undefined))
    }
  }

  const buttons: IButton[] = [
    {
      action: ButtonAction.CUT, 
      onClick: handleCut
    },
    {
      action: ButtonAction.COPY,
      onClick: handleCopy
    },
    {
      action: ButtonAction.PASTE, 
      onClick: handlePaste
    },
  ]

  return (
    <menu className="context-menu">
      {buttons.map((button: IButton) => (
        <button 
          className="context-menu-button"
          disabled={disabled(button.action)}
          key={button.action}
          onClick={button.onClick}
        >
          {button.action}
        </button>
      ))}
    </menu>
  )
}