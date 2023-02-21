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
  data?: NFT[];
  meta: Meta;
};

export interface DetailNFTState {
  profileData: {
    status: FetchStatus;
    response?: FetchMyNFTSuccess;
  };
  listedData: {
    status: FetchStatus;
    response?: FetchMyNFTSuccess;
  };
}

export type FetchPrams = {
  page: number;
  limit: number;
  sort: "DESC" | "ASC";
};

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

export const fetchMyListingNFTs = createAsyncThunk(
  "profile/my-listing-nft",
  async (params: FetchPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchMyNFTSuccess>(
        `/nft/listed-on-market?page=${params.page}&limit=${params.limit}&sortBy=id:${params.sort}`
      );
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
  listedData: {
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
    builder
      .addCase(fetchMyListingNFTs.pending, (state) => {
        state.listedData.status = FetchStatus.pending;
        state.listedData.response = undefined;
      })
      .addCase(fetchMyListingNFTs.fulfilled, (state, action) => {
        state.listedData.status = FetchStatus.succeeded;
        state.listedData.response = action.payload;
      })
      .addCase(fetchMyListingNFTs.rejected, (state, action) => {
        state.listedData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = profileSlice.actions;

export default profileSlice.reducer;
