import { createSlice } from "@reduxjs/toolkit"
import { IDirectory } from "./directory.type"
import { RootState } from "#app/store"
import { DirType } from "./directory.config"

export interface DirectoryState {
  directoryData: IDirectory
}

const initialState: DirectoryState = {
  directoryData: {
    id: 0,
    name: "root",
    type: DirType.FOLDER,
    children: []
  }
}

export const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {
  },
})

export const selectDirectoryData = (state: RootState) => state.directory.directoryData

export default directorySlice.reducer
