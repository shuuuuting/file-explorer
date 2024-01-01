import { createSlice } from "@reduxjs/toolkit"
import { ITab } from "./tab.type"
import { RootState } from "#app/store"

export interface TabState {
  activeTabId?: string,
  showedTabs: ITab[],
}

const initialState: TabState = {
  activeTabId: "0",
  showedTabs: [
    {
      id: "0",
      name: "00"
    },
    {
      id: "1",
      name: "11"
    },
    {
      id: "2",
      name: "22"
    },
  ]
}

export const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    saveActiveTabId: (state, { payload }) => {
      state.activeTabId = payload
    },
    addShowedTab: (state, { payload }) => {
      state.showedTabs = [...state.showedTabs, payload]
      state.activeTabId = payload.id
    },
    // removeTabs
  },
})

export const { saveActiveTabId, addShowedTab } = tabSlice.actions

export const selectActiveTabId = (state: RootState) => state.tab.activeTabId
export const selectShowedTabs = (state: RootState) => state.tab.showedTabs

export default tabSlice.reducer
