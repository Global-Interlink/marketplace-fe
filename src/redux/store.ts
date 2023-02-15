import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./app/appSlice";
import homeReducer from "./home/homeSlice";
import verifyReducer from "./verify/verifySlice";
import searchReducer from "./search/searchSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    home: homeReducer,
    verify: verifyReducer,
    search: searchReducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
