import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import directoryReducer from "../components/sidebar/components/directory/directory.slice"
import tabReducer from "#components/editpane/components/tab/tab.slice"

export const store = configureStore({
  reducer: {
    directory: directoryReducer,
    tab: tabReducer
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
