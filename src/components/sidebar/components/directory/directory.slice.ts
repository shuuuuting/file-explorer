import { createSlice } from "@reduxjs/toolkit"
import { IDirectory } from "./directory.type"
import { RootState } from "#app/store"
import { DirType } from "./directory.config"
import { filterDirs, insertNewDir, pruneDir, updateDirName } from "./directory.utils"

export interface DirectoryState {
  directoryData: IDirectory,
  showedDirectoryData: IDirectory | undefined,
  searchTerm: string
}

const initialState: DirectoryState = {
  directoryData: {
    id: "0",
    name: "root",
    type: DirType.FOLDER,
    children: [
      {
        id: "1",
        name: "happy",
        type: DirType.JS,
        children: [
          {
            id: "11",
            name: "happy11",
            type: DirType.JS,
            children: [
              
            ]
          }
        ]
      },
      {
        id: "2",
        name: "sappy",
        type: DirType.JS,
        children: [
          
        ]
      }
    ]
  },
  showedDirectoryData: undefined,
  searchTerm: ""
}

export const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {
    renameDir: (state, { payload }) => {
      state.directoryData = updateDirName(
        state.directoryData,
        payload.id,
        payload.newDirName
      )
    },
    addDir: (state, { payload }) => {
      state.directoryData = insertNewDir(
        state.directoryData,
        payload.parentId,
        payload.newDir
      )
    },
    removeDir: (state, { payload }) => {
      state.directoryData = pruneDir(
        state.directoryData, 
        payload
      )
    },
    searchDirs: (state, { payload }) => {
      state.searchTerm = payload
      state.showedDirectoryData = filterDirs(
        state.directoryData,
        payload
      )
    }
  },
})

export const { renameDir, addDir, removeDir, searchDirs } = directorySlice.actions

export const selectDirectoryData = (state: RootState) => state.directory.directoryData
export const selectShowedDirectoryData = (state: RootState) => state.directory.showedDirectoryData
export const selectSearchTerm = (state: RootState) => state.directory.searchTerm

export default directorySlice.reducer
