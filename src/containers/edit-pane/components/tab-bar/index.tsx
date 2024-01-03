import React from "react"
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { ITab } from "../../edit-pane.interface"
import { MdClear } from "react-icons/md"
import { removeTab, saveActiveTabId, selectActiveTabId, selectShowedTabs } from "#containers/edit-pane/edit-pane.slice"

export const Tab: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeTabId = useAppSelector(selectActiveTabId)
  const showedTabs = useAppSelector(selectShowedTabs)

  const handleClick = (id: string) => {
    dispatch(saveActiveTabId(id))
  }

  const handleRemove = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation()
    dispatch(removeTab(id))
  }

  return (
    <div className="tabs-container">
      {showedTabs.map((tab: ITab) => (
        <div 
          key={tab.id}
          className={`tab-item${tab.id === activeTabId ? " active-tab": ""}`}
          onClick={() => handleClick(tab.id)}
        >
          {tab.name}
          <span 
            className="tab-item-button"
            onClick={(e) => handleRemove(e, tab.id)}
          >
            <MdClear />
          </span>
        </div>
      ))}
    </div>
  )
}
