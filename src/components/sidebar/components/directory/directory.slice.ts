import { createSlice } from "@reduxjs/toolkit"
import { IDirectory } from "./directory.type"
import { RootState } from "#app/store"
import { DirType } from "./directory.config"
import { insertNewDir } from "./directory.utils"

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
    addNewDir: (state, { payload }) => {
      state.directoryData = insertNewDir(
        state.directoryData,
        payload.parentId,
        payload.newChild
      )
    },
  },
})

export const { addNewDir } = directorySlice.actions

export const selectDirectoryData = (state: RootState) => state.directory.directoryData

export default directorySlice.reducer
