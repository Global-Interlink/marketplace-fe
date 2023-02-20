import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./app/appSlice";
import homeReducer from "./home/homeSlice";
import verifyReducer from "./verify/verifySlice";
import searchReducer from "./search/searchSlice";
import collectionReducer from "./collection/collectionSlice";
import nftReducer from "./nft/nftSlice";
import profileSlice from "./profile/profileSlice";
export const store = configureStore({
  reducer: {
    app: appReducer,
    home: homeReducer,
    verify: verifyReducer,
    search: searchReducer,
    collection: collectionReducer,
    nft: nftReducer,
    profie: profileSlice,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
