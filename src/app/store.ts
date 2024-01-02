import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import editPaneReducer from "#containers/edit-pane/edit-pane.slice"
import navBarReducer from "#containers/nav-bar/nav-bar.slice"

export const store = configureStore({
  reducer: {
    navbar: navBarReducer,
    editpane: editPaneReducer
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
