import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import editPaneReducer from "#containers/edit-pane/edit-pane.slice"
import navBarReducer from "#containers/nav-bar/nav-bar.slice"
import { combineReducers } from "redux"
import storage from "redux-persist/lib/storage"
import { persistReducer } from "redux-persist"

const reducers = combineReducers({
  navbar: navBarReducer,
  editpane: editPaneReducer
})

const persistConfig = {
  key: "root",
  storage
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      }
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
