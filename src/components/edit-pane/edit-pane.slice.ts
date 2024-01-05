import { createSlice } from "@reduxjs/toolkit"
import { IFileContent, ITab } from "./edit-pane.interface"
import { RootState } from "#app/store"
import { pruneFileContentById, pruneTabById, updateFileContentById, updateTabNameById } from "./editor/editor.helper"

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
    addTab: (state, { payload }) => {
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
    removeTab: (state, { payload }) => {
      const prunedTabs = pruneTabById(state.showedTabs, payload)
      state.showedTabs = prunedTabs 
      if (prunedTabs.length === 0) {
        state.activeTabId = undefined
      } else if (state.activeTabId === payload) {
        state.activeTabId = prunedTabs[0].id
      }
    },
    addFileContent: (state, { payload }) => {
      state.fileContents = [...state.fileContents, payload]
    },
    removeFileContent: (state, { payload }) => {
      const { newFileContents, newShowedTabs } = pruneFileContentById(
        state.fileContents,
        state.showedTabs,
        payload
      )
      state.fileContents = newFileContents
      state.showedTabs = newShowedTabs
      if (newShowedTabs.length === 0) {
        state.activeTabId = undefined
      } else if (state.activeTabId === payload) {
        state.activeTabId = newShowedTabs[0].id
      }
    },
    cacheDraftContent: (state, { payload }) => {
      const { newFileContents, newShowedTabs } = updateFileContentById(
        state.fileContents,
        state.showedTabs,
        payload.id,
        true,
        payload.content
      )
      state.fileContents = newFileContents
      state.showedTabs = newShowedTabs
    },
    updateFileContent: (state, { payload }) => {
      const { newFileContents, newShowedTabs } = updateFileContentById(
        state.fileContents,
        state.showedTabs,
        payload.id,
        false,
        ""
      )
      state.fileContents = newFileContents
      state.showedTabs = newShowedTabs
    }
  },
})

export const { 
  saveActiveTabId, addTab, renameTab, 
  removeTab, addFileContent, removeFileContent, 
  cacheDraftContent, updateFileContent 
} = editPaneSlice.actions

export const selectActiveTabId = (state: RootState) => state.editpane.activeTabId
export const selectShowedTabs = (state: RootState) => state.editpane.showedTabs
export const selectShowedTabById = (state: RootState, id: string) => 
  state.editpane.showedTabs.find(fileContent => fileContent.id === id)
export const selectFileById = (state: RootState, id: string) => 
  state.editpane.fileContents.find(fileContent => fileContent.id === id)

export default editPaneSlice.reducer
