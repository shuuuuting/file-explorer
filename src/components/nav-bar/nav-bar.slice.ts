import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "#app/store"
import { IDirectory } from "./directory/directory.type"
import { DirType } from "./directory/directory.config"
import { insertNewDir, pruneDirById, traverseAndModifyOne, updateDirNameById, updateVisibility } from "./directory/directory.helper"
import { ButtonAction } from "./context-menu"

export interface NavBarState {
  dirData: IDirectory,
  cachedDirInfo?: { action: ButtonAction, dirData: IDirectory },
  searchTerm: string,
  openedMenuId?: string,
  warningMsg: string
}

const initialState: NavBarState = {
  dirData: {
    id: "0",
    name: "root",
    path: "root",
    type: DirType.FOLDER,
    isExpanded: true,
    isVisible: true,
    children: []
  },
  searchTerm: "",
  warningMsg: ""
}

export const navBarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    renameDir: (state, { payload }) => {
      state.dirData = updateDirNameById(
        state.dirData,
        payload.id,
        payload.newName
      )
    },
    addDir: (state, { payload }) => {
      state.dirData = insertNewDir(
        state.dirData,
        payload.parentId,
        payload.newDir
      )
    },
    removeDir: (state, { payload }) => {
      state.dirData = pruneDirById(
        state.dirData, 
        payload
      )
    },
    saveExpandedDir: (state, { payload }) => {
      state.dirData = traverseAndModifyOne(
        state.dirData, 
        payload.id, 
        payload.key, 
        payload.newData
      )
    },
    saveCachedInfo: (state, { payload }) => {
      state.cachedDirInfo = payload
    },
    saveSearchTerm: (state, { payload }) => {
      state.searchTerm = payload
    },
    searchDirs: (state) => {
      state.dirData = updateVisibility(
        state.dirData,
        state.searchTerm
      )
    },
    saveOpenedMenuId: (state, { payload }) => {
      state.openedMenuId = payload
    },
    saveWarningMsg: (state, { payload }) => {
      state.warningMsg = payload
    },
  },
})

export const { 
  renameDir, addDir, removeDir, saveExpandedDir, 
  saveCachedInfo, saveSearchTerm, searchDirs, 
  saveOpenedMenuId, saveWarningMsg 
} = navBarSlice.actions

export const selectDirData = (state: RootState) => state.navbar.dirData
export const selectCachedDirInfo = (state: RootState) => state.navbar.cachedDirInfo
export const selectSearchTerm = (state: RootState) => state.navbar.searchTerm
export const selectOpenedMenuId = (state: RootState) => state.navbar.openedMenuId
export const selectWarningMsg = (state: RootState) => state.navbar.warningMsg

export default navBarSlice.reducer
