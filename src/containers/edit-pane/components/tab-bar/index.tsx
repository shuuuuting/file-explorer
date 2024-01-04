import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "#app/hooks"
import { ITab } from "../../edit-pane.interface"
import { MdCircle } from "react-icons/md"
import { MdClear } from "react-icons/md"
import { removeTab, saveActiveTabId, selectActiveTabId, selectShowedTabs } from "#containers/edit-pane/edit-pane.slice"

export const TabBar: React.FC = () => {
  const dispatch = useAppDispatch()
  const activeTabId = useAppSelector(selectActiveTabId)
  const showedTabs = useAppSelector(selectShowedTabs)

  useEffect(() => {
    if (activeTabId) document.getElementById(`tab-${activeTabId}`)?.scrollIntoView()
  }, [activeTabId])

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
          id={`tab-${tab.id}`}
          key={tab.id}
          className={`tab-item${tab.id === activeTabId ? " active-tab": ""}`}
          onClick={() => handleClick(tab.id)}
        >
          {tab.name}
          {tab.isUnsaved && 
            <span className="tab-item-icon"><MdCircle /></span>
          }
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
