import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { APIFunctions, FetchStatus } from "../../api/APIFunctions";
// import { Launchpad } from "../../api/types";

interface Owner {
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  address: {
    id: string;
    createdAt: string;
    lastUpdatedAt: string;
    address: string;
    network: {
      id: string;
      createdAt: string;
      lastUpdatedAt: string;
      network_id: string;
      providerUrl: null;
    };
  };
}

export interface TxData {
  description: string;
  metadata: string;
  name: string;
  tokenId: string;
  url: string;
  id: string;
  createdAt: string;
  lastUpdatedAt: string;
  owner: Owner;
}

export type VerifyParams = {
  txnHash: string;
};

export type CommonError = {
  statusCode: number;
  message: string;
};

export interface DetailNFTState {
  verifyData: {
    status: FetchStatus;
    response?: TxData[];
  };
}

export const verifyTransaction = createAsyncThunk(
  "verify/verifyTx",
  async (params: VerifyParams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.post<TxData[]>(
        "/launchpad/verify-mint-transaction",
        params
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: DetailNFTState = {
  verifyData: {
    status: FetchStatus.idle,
  },
};

export const verifySlice = createSlice({
  name: "verify",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyTransaction.pending, (state) => {
        state.verifyData.status = FetchStatus.pending;
        state.verifyData.response = undefined;
      })
      .addCase(verifyTransaction.fulfilled, (state, action) => {
        state.verifyData.status = FetchStatus.succeeded;
        console.log("===action", action);
        state.verifyData.response = action.payload;
      })
      .addCase(verifyTransaction.rejected, (state, action) => {
        state.verifyData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        console.log("====verifyError: ", error);
        // toast.error(error?.message);
      });
  },
});

export const { clear } = verifySlice.actions;

export default verifySlice.reducer;
