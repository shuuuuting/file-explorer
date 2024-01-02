import { createSlice } from "@reduxjs/toolkit"
import { IFileContent, ITab } from "./edit-pane.type"
import { RootState } from "#app/store"
import { updateFileContentById, updateTabNameById } from "./components/editor/editor.utils"

export interface EditPaneState {
  activeTabId?: string,
  showedTabs: ITab[],
  fileContents: IFileContent[]
}

const initialState: EditPaneState = {
  showedTabs: [],
  fileContents: []
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
    renameTab: (state, { payload }) => {
      state.showedTabs = updateTabNameById(
        state.showedTabs,
        payload.id,
        payload.newName
      )
    },
    addFileContent: (state, { payload }) => {
      state.fileContents = [...state.fileContents, payload]
    },
    updateFileContent: (state, { payload }) => {
      state.fileContents = updateFileContentById(
        state.fileContents,
        payload.id,
        payload.content
      )
    },
    // removeTab
  },
})

export const { saveActiveTabId, addShowedTab, renameTab, addFileContent, updateFileContent } = editPaneSlice.actions

export const selectActiveTabId = (state: RootState) => state.editpane.activeTabId
export const selectShowedTabs = (state: RootState) => state.editpane.showedTabs
export const selectShowedTabById = (state: RootState, id: string) => 
  state.editpane.showedTabs.find(fileContent => fileContent.id === id)
export const selectFileById = (state: RootState, id: string) => 
  state.editpane.fileContents.find(fileContent => fileContent.id === id)

export default editPaneSlice.reducer
