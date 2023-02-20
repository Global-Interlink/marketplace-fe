import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { APIFunctions, FetchStatus } from "../../api/APIFunctions";
import { NFT, Meta } from "../../api/types";

export type FetchNFTDetailPrams = {
  id: string;
};

export type CommonError = {
  statusCode: number;
  message: string;
};

export type FetchMyNFTSuccess = {
  result?: NFT[];
};

export interface DetailNFTState {
  profileData: {
    status: FetchStatus;
    response?: FetchMyNFTSuccess;
  };
}

export const fetchMyNFTs = createAsyncThunk(
  "profile/my-nft",
  async (_, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchMyNFTSuccess>(`/nft`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: DetailNFTState = {
  profileData: {
    status: FetchStatus.idle,
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyNFTs.pending, (state) => {
        state.profileData.status = FetchStatus.pending;
        state.profileData.response = undefined;
      })
      .addCase(fetchMyNFTs.fulfilled, (state, action) => {
        state.profileData.status = FetchStatus.succeeded;
        state.profileData.response = action.payload;
      })
      .addCase(fetchMyNFTs.rejected, (state, action) => {
        state.profileData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = profileSlice.actions;

export default profileSlice.reducer;
