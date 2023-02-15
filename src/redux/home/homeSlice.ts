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

export interface DetailNFTState {
  homeData: {
    status: FetchStatus;
    response?: FetchListLaunchpadSuccess;
  };
}

export const fetchLaunchpadList = createAsyncThunk(
  "home/launchpad/list",
  async (time_status: string, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchListLaunchpadSuccess>(
        `/launchpad?time_status=${time_status}`
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
      .addCase(fetchLaunchpadList.pending, (state) => {
        state.homeData.status = FetchStatus.pending;
        state.homeData.response = undefined;
      })
      .addCase(fetchLaunchpadList.fulfilled, (state, action) => {
        state.homeData.status = FetchStatus.succeeded;
        state.homeData.response = action.payload;
      })
      .addCase(fetchLaunchpadList.rejected, (state, action) => {
        state.homeData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = homeSlice.actions;

export default homeSlice.reducer;
