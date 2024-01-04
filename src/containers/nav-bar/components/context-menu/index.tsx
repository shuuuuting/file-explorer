import { useAppDispatch, useAppSelector } from "#app/hooks"
import { addDir, removeDir, saveCachedDir, selectCachedDirData } from "#containers/nav-bar/nav-bar.slice"
import { DirType } from "../directory/directory.config"
import { IDirectory } from "../directory/directory.type"
import { traverseAndModify } from "../directory/directory.utils"

const enum ButtonAction {
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
  if (dirType === DirType.FOLDER) {
    return `${dirName} copy`
  }

  const parts = dirName.split(".")
  const extension = parts.pop()

  let copyName = `${parts.join(".")} copy`
  if (extension) {
    copyName += `.${extension}`
  }
  return copyName
}

export const ContextMenu = ({ dirData }: { dirData: IDirectory }) => {
  const dispatch = useAppDispatch()
  const cachedDirData = useAppSelector(selectCachedDirData)
  const disabled = (action: ButtonAction) => (
    (dirData.id === "0" && [ButtonAction.CUT, ButtonAction.COPY].includes(action))
    || ((!cachedDirData || dirData.type !== DirType.FOLDER) && action === ButtonAction.PASTE)
  )

  const handleCut = () => {
    dispatch(saveCachedDir(dirData))
    dispatch(removeDir(dirData.id))
  }
  
  const handleCopy = () => {
    dispatch(saveCachedDir(dirData))
  }

  const handlePaste = () => {
    if (cachedDirData) {
      let newDir = { 
        ...cachedDirData, 
        name: hasDuplicateName(dirData.children, cachedDirData.name) 
                ? getCopyName(cachedDirData.name, cachedDirData.type) 
                : cachedDirData.name
      }
      newDir = traverseAndModify(newDir, "id", () => new Date().toISOString())
      dispatch(addDir({ parentId: dirData.id, newDir }))
      dispatch(saveCachedDir(undefined))
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