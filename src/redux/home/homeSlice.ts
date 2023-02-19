import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { APIFunctions, FetchStatus } from "../../api/APIFunctions";
import { Collection, Meta } from "../../api/types";

export type FetchListCollectionSuccess = {
  data: Collection[];
  meta: Meta;
};
export type FetchListCollectionPrams = {
  page: number;
  limit: number;
  sort: "DESC" | "ASC";
};

export type CommonError = {
  statusCode: number;
  message: string;
};

export interface DetailNFTState {
  homeData: {
    status: FetchStatus;
    response?: FetchListCollectionSuccess;
  };
}

export const fetchListCollection = createAsyncThunk(
  "home/collections",
  async (params: FetchListCollectionPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchListCollectionSuccess>(
        `/nft-collection?page=${params.page}&limit=${params.limit}&sortBy=id:${params.sort}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: DetailNFTState = {
  homeData: {
    status: FetchStatus.idle,
  },
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListCollection.pending, (state) => {
        state.homeData.status = FetchStatus.pending;
        state.homeData.response = undefined;
      })
      .addCase(fetchListCollection.fulfilled, (state, action) => {
        state.homeData.status = FetchStatus.succeeded;
        state.homeData.response = action.payload;
      })
      .addCase(fetchListCollection.rejected, (state, action) => {
        state.homeData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = homeSlice.actions;

export default homeSlice.reducer;
