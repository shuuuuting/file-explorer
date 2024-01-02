import React from "react"
import { useAppSelector } from "#app/hooks"
import { ITab } from "../../edit-pane.type"
import { MdClear } from "react-icons/md"
import { selectActiveTabId, selectShowedTabs } from "#containers/edit-pane/edit-pane.slice"

export const Tab: React.FC = () => {
  const activeTabId = useAppSelector(selectActiveTabId)
  const showedTabs = useAppSelector(selectShowedTabs)

  return (
    <div className="tabs-container">
      {showedTabs.map((tab: ITab) => (
        <div 
          key={tab.id}
          className={`tab-item${tab.id === activeTabId ? " active-tab": ""}`}
        >
          {tab.name}
          <span className="tab-item-button">
            <MdClear />
          </span>
        </div>
      ))}
    </div>
  )
}
