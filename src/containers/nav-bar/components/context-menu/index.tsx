import { useAppDispatch, useAppSelector } from "#app/hooks"
import { addDir, removeDir, saveCachedDir, selectCachedDirData } from "#containers/nav-bar/nav-bar.slice"
import { DirType } from "../directory/directory.config"
import { IDirectory } from "../directory/directory.type"

const enum ButtonAction {
  CUT = "Cut",
  COPY = "Copy",
  PASTE = "Paste"
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
      dispatch(addDir({ 
        parentId: dirData.id, 
        newDir: { ...cachedDirData, id: new Date().toISOString() } 
      }))
      dispatch(saveCachedDir(undefined))
    }
  }

  const buttons = [
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
      {buttons.map((button) => (
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