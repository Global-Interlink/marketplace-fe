import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { APIFunctions, FetchStatus } from "../../api/APIFunctions";
import { Launchpad } from "../../api/types";

export type FetchListLaunchpadSuccess = {
  data: Launchpad[];
};
export type FetchListLaunchpadPrams = any;

export type CommonError = {
  statusCode: number;
  message: string;
};

export interface SearchState {
  searchData: {
    status: FetchStatus;
    response?: FetchListLaunchpadSuccess;
  };
}

export const searchLaunchpad = createAsyncThunk(
  "search/launchpad",
  async (searchWord: string, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchListLaunchpadSuccess>(
        `/launchpad?search=${searchWord}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: SearchState = {
  searchData: {
    status: FetchStatus.idle,
  },
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLaunchpad.pending, (state) => {
        state.searchData.status = FetchStatus.pending;
        state.searchData.response = undefined;
      })
      .addCase(searchLaunchpad.fulfilled, (state, action) => {
        state.searchData.status = FetchStatus.succeeded;
        state.searchData.response = action.payload;
      })
      .addCase(searchLaunchpad.rejected, (state, action) => {
        state.searchData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = searchSlice.actions;

export default searchSlice.reducer;
