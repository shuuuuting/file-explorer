import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "#app/store"
import { IDirectory } from "./components/directory/directory.type"
import { DirType } from "./components/directory/directory.config"
import { filterDirs, insertNewDir, pruneDirById, updateDirNameById } from "./components/directory/directory.utils"

export interface NavBarState {
  dirData: IDirectory,
  showedDirData: IDirectory | undefined,
  searchTerm: string
}

const initialState: NavBarState = {
  dirData: {
    id: "0",
    name: "root",
    type: DirType.FOLDER,
    children: [
      {
        id: "1",
        name: "happy.js",
        type: DirType.JS,
        children: [
          {
            id: "11",
            name: "happy11.ts",
            type: DirType.TS,
            children: [
              
            ]
          }
        ]
      },
      {
        id: "2",
        name: "sappy",
        type: DirType.OTHERS,
        children: [
          
        ]
      }
    ]
  },
  showedDirData: undefined,
  searchTerm: ""
}

export const navBarSlice = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    renameDir: (state, { payload }) => {
      state.dirData = updateDirNameById(
        state.dirData,
        payload.id,
        payload.newDirName
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
    searchDirs: (state, { payload }) => {
      state.searchTerm = payload
      state.showedDirData = filterDirs(
        state.dirData,
        payload
      )
    }
  },
})

export const { renameDir, addDir, removeDir, searchDirs } = navBarSlice.actions

export const selectDirData = (state: RootState) => state.navbar.dirData
export const selectShowedDirData = (state: RootState) => state.navbar.showedDirData
export const selectSearchTerm = (state: RootState) => state.navbar.searchTerm

export default navBarSlice.reducer
