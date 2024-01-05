import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "#app/store"
import { IDirectory } from "./components/directory/directory.type"
import { DirType } from "./components/directory/directory.config"
import { filterDirs, insertNewDir, pruneDirById, traverseAndModifyOne, updateDirNameById } from "./components/directory/directory.utils"
import { ButtonAction } from "./components/context-menu"

export interface NavBarState {
  dirData: IDirectory,
  showedDirData?: IDirectory,
  cachedDirInfo?: { action: ButtonAction, dirData: IDirectory },
  searchTerm: string,
  openedMenuId?: string
}

const initialState: NavBarState = {
  dirData: {
    id: "0",
    name: "root",
    type: DirType.FOLDER,
    isExpanded: true,
    children: [
      {
        id: "1",
        name: "happy",
        type: DirType.FOLDER,
        isExpanded: false,
        children: [
          {
            id: "11",
            name: "happy11.ts",
            type: DirType.TS,
            isExpanded: false,
            children: [
              
            ]
          }
        ]
      },
      {
        id: "2",
        name: "sappy",
        type: DirType.OTHERS,
        isExpanded: false,
        children: [
          
        ]
      }
    ]
  },
  showedDirData: undefined,
  cachedDirInfo: undefined,
  searchTerm: ""
}

export const navBarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    renameDir: (state, { payload }) => {
      const new1 = updateDirNameById(
        state.dirData,
        payload.id,
        payload.newName
      )
      state.dirData = new1
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
    saveCachedInfo: (state, { payload }) => {
      state.cachedDirInfo = payload
    },
    saveSearchTerm: (state, { payload }) => {
      state.searchTerm = payload
    },
    searchDirs: (state) => {
      state.showedDirData = filterDirs(
        state.dirData,
        state.searchTerm
      )
    },
    saveOpenedMenuId: (state, { payload }) => {
      state.openedMenuId = payload
    },
    saveExpandedDir: (state, { payload }) => {
      state.dirData = traverseAndModifyOne(state.dirData, payload.id, payload.key, payload.newData)
    },
  },
})

export const { renameDir, addDir, removeDir, saveCachedInfo, saveSearchTerm, searchDirs, saveOpenedMenuId, saveExpandedDir } = navBarSlice.actions

export const selectDirData = (state: RootState) => state.navbar.dirData
export const selectShowedDirData = (state: RootState) => state.navbar.showedDirData
export const selectCachedDirInfo = (state: RootState) => state.navbar.cachedDirInfo
export const selectSearchTerm = (state: RootState) => state.navbar.searchTerm
export const selectOpenedMenuId = (state: RootState) => state.navbar.openedMenuId

export default navBarSlice.reducer
