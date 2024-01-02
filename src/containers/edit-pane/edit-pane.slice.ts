import { createSlice } from "@reduxjs/toolkit"
import { ITab } from "./edit-pane.type"
import { RootState } from "#app/store"

export interface EditPaneState {
  activeTabId?: string,
  showedTabs: ITab[],
}

const initialState: EditPaneState = {
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

export const editPaneSlice = createSlice({
  name: "editpane",
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

export const { saveActiveTabId, addShowedTab } = editPaneSlice.actions

export const selectActiveTabId = (state: RootState) => state.editpane.activeTabId
export const selectShowedTabs = (state: RootState) => state.editpane.showedTabs

export default editPaneSlice.reducer
