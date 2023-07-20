import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { APIFunctions, FetchStatus } from "../../api/APIFunctions";
import { Collection, Meta, NFT } from "../../api/types";

export type FetchCollectionDetailPrams = {
  id: string;
};

export type CommonError = {
  statusCode: number;
  message: string;
};

export type FetchListCollectionNFTSuccess = {
  data: NFT[];
  meta: Meta;
};
export type FetchListCollectionNFTPrams = {
  page: number;
  limit: number;
  sort: "DESC" | "ASC";
  id: string;
  queries?: string;
};

export interface DetailNFTState {
  collectionData: {
    status: FetchStatus;
    response?: Collection;
  };
  nftData: {
    status: FetchStatus;
    response?: FetchListCollectionNFTSuccess;
  };
  filterItems: {
    status: FetchStatus;
    properties?: any;
  };
}

export const fetchCollectionDetail = createAsyncThunk(
  "collection/collection-detail",
  async (params: FetchCollectionDetailPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<Collection>(
        `/nft-collection/${params.id}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchListNFTOfCollection = createAsyncThunk(
  "collection/collections",
  async (params: FetchListCollectionNFTPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchListCollectionNFTSuccess>(
        `/nft/by-collection/${params.id}?page=${params.page}&limit=${params.limit}&sortBy=saleItems.price:${params.sort}${params.queries
          ? `&${params.queries}`
          : ""}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchFilterItems = createAsyncThunk(
  "collection/filter-item",
  async (params: { id: string }, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchListCollectionNFTSuccess>(
        `/nft-property/collection/${params.id}/filter-property-data`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

// /api/v1/nft-property/collection/<id collection>/filter-property-data

const initialState: DetailNFTState = {
  collectionData: {
    status: FetchStatus.idle,
    response: undefined,
  },
  nftData: {
    status: FetchStatus.idle,
    response: undefined,
  },
  filterItems: {
    status: FetchStatus.idle,
    properties: undefined,
  },
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    clear: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionDetail.pending, (state) => {
        state.collectionData.status = FetchStatus.pending;
        state.collectionData.response = undefined;
      })
      .addCase(fetchCollectionDetail.fulfilled, (state, action) => {
        state.collectionData.status = FetchStatus.succeeded;
        state.collectionData.response = action.payload;
      })
      .addCase(fetchCollectionDetail.rejected, (state, action) => {
        state.collectionData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });

    builder
      .addCase(fetchListNFTOfCollection.pending, (state) => {
        state.nftData.status = FetchStatus.pending;
        state.nftData.response = undefined;
      })
      .addCase(fetchListNFTOfCollection.fulfilled, (state, action) => {
        state.nftData.status = FetchStatus.succeeded;
        state.nftData.response = action.payload;
      })
      .addCase(fetchListNFTOfCollection.rejected, (state, action) => {
        state.nftData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
    builder
      .addCase(fetchFilterItems.pending, (state) => {
        state.filterItems.status = FetchStatus.pending;
        state.filterItems.properties = undefined;
      })
      .addCase(fetchFilterItems.fulfilled, (state, action) => {
        state.filterItems.status = FetchStatus.succeeded;
        state.filterItems.properties = action.payload;
      })
      .addCase(fetchFilterItems.rejected, (state, action) => {
        state.filterItems.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = collectionSlice.actions;

export default collectionSlice.reducer;
