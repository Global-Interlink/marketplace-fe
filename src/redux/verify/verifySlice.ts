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
  txhash: string;
  chain: string;
};

export type CommonError = {
  statusCode: number;
  message: string;
};

export interface DetailNFTState {
  verifyDelist: {
    status: FetchStatus;
    response?: TxData[];
  };
  verifySale: {
    status: FetchStatus;
    response?: TxData[];
  };
  verifyBuy: {
    status: FetchStatus;
    response?: TxData[];
  };
}

export const verifyDelistTransaction = createAsyncThunk(
  "verify/verifyDelistTx",
  async (data: { id: string; params: VerifyParams }, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.post<TxData[]>(
        `/nft/${data.id}/update-delist-event`,
        data.params
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyBuyTransaction = createAsyncThunk(
  "verify/verifyBuyTx",
  async (data: { id: string; params: VerifyParams }, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.post<TxData[]>(
        `/nft/${data.id}/update-from-buy-event`,
        data.params
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifySaleTransaction = createAsyncThunk(
  "verify/verifySaleTx",
  async (data: { id: string; params: VerifyParams }, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.post<TxData[]>(
        `/nft/${data.id}/update-put-on-sale-event`,
        data.params
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState: DetailNFTState = {
  verifyBuy: {
    status: FetchStatus.idle,
  },
  verifyDelist: {
    status: FetchStatus.idle,
  },
  verifySale: {
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
      .addCase(verifyDelistTransaction.pending, (state) => {
        state.verifyDelist.status = FetchStatus.pending;
        state.verifyDelist.response = undefined;
      })
      .addCase(verifyDelistTransaction.fulfilled, (state, action) => {
        state.verifyDelist.status = FetchStatus.succeeded;
        state.verifyDelist.response = action.payload;
      })
      .addCase(verifyDelistTransaction.rejected, (state, action) => {
        state.verifyDelist.status = FetchStatus.failed;
      });

    builder
      .addCase(verifyBuyTransaction.pending, (state) => {
        state.verifyBuy.status = FetchStatus.pending;
        state.verifyBuy.response = undefined;
      })
      .addCase(verifyBuyTransaction.fulfilled, (state, action) => {
        state.verifyBuy.status = FetchStatus.succeeded;
        state.verifyBuy.response = action.payload;
      })
      .addCase(verifyBuyTransaction.rejected, (state, action) => {
        state.verifyBuy.status = FetchStatus.failed;
      });

    builder
      .addCase(verifySaleTransaction.pending, (state) => {
        state.verifySale.status = FetchStatus.pending;
        state.verifySale.response = undefined;
      })
      .addCase(verifySaleTransaction.fulfilled, (state, action) => {
        state.verifySale.status = FetchStatus.succeeded;
        state.verifySale.response = action.payload;
      })
      .addCase(verifySaleTransaction.rejected, (state, action) => {
        state.verifySale.status = FetchStatus.failed;
      });
  },
});

export const { clear } = verifySlice.actions;

export default verifySlice.reducer;
