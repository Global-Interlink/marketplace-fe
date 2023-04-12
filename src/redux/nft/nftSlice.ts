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

export type FetchListNFTNFTSuccess = {
  data: NFT[];
  meta: Meta;
};
export type FetchListNFTNFTPrams = {
  // page: number;
  // limit: number;
  // sort: "DESC" | "ASC";
  id: string;
};

export interface DetailNFTState {
  nftData: {
    status: FetchStatus;
    response?: NFT;
  };
  listNFTData: {
    status: FetchStatus;
    response?: FetchListNFTNFTSuccess;
  };
}

export const fetchNFTDetail = createAsyncThunk(
  "nft/nft-detail",
  async (params: FetchNFTDetailPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<NFT>(`/nft/${params.id}`);
      return response.data;
    } catch (err: any) {
      console.log("=eeeeee", err);
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchListNFTOfNFT = createAsyncThunk(
  "nft/nfts",
  async (params: FetchListNFTNFTPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchListNFTNFTSuccess>(
        `/nft/${params.id}/others-in-collection`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: DetailNFTState = {
  nftData: {
    status: FetchStatus.idle,
  },
  listNFTData: {
    status: FetchStatus.idle,
  },
};

export const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNFTDetail.pending, (state) => {
        state.nftData.status = FetchStatus.pending;
        state.nftData.response = undefined;
      })
      .addCase(fetchNFTDetail.fulfilled, (state, action) => {
        state.nftData.status = FetchStatus.succeeded;
        state.nftData.response = action.payload;
      })
      .addCase(fetchNFTDetail.rejected, (state, action) => {
        state.nftData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });

    builder
      .addCase(fetchListNFTOfNFT.pending, (state) => {
        state.listNFTData.status = FetchStatus.pending;
        state.listNFTData.response = undefined;
      })
      .addCase(fetchListNFTOfNFT.fulfilled, (state, action) => {
        state.listNFTData.status = FetchStatus.succeeded;
        state.listNFTData.response = action.payload;
      })
      .addCase(fetchListNFTOfNFT.rejected, (state, action) => {
        state.listNFTData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        // toast.error(error?.message);
      });
  },
});

export const { clear } = nftSlice.actions;

export default nftSlice.reducer;
