import { createSlice } from "@reduxjs/toolkit"
import { IDirectory } from "./directory.type"
import { RootState } from "#app/store"
import { DirType } from "./directory.config"
import { insertNewDir, pruneDir, updateDirName } from "./directory.utils"

export interface DirectoryState {
  directoryData: IDirectory
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
          
        ]
      }
    ]
  }
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
  },
})

export const { renameDir, addDir, removeDir } = directorySlice.actions

export const selectDirectoryData = (state: RootState) => state.directory.directoryData

export default directorySlice.reducer
