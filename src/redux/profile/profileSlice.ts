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
interface User {
  listedItems: number;
  totalInMyWallet: number;
  totalItems: number;
}
export interface DetailNFTState {
  profileData: {
    status: FetchStatus;
    response?: FetchMyNFTSuccess;
  };
  listedData: {
    status: FetchStatus;
    response?: FetchMyNFTSuccess;
  };
  userData: {
    status: FetchStatus;
    response?: User;
  };
}

export type FetchPrams = {
  page: number;
  limit: number;
  sort: "DESC" | "ASC";
};

export const fetchMyNFTs = createAsyncThunk(
  "profile/my-nft",
  async (params: FetchPrams, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<FetchMyNFTSuccess>(
        `/nft?page=${params.page}&limit=${params.limit}&sortBy=id:${params.sort}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "profile/user",
  async (_, { rejectWithValue }) => {
    try {
      const response = await APIFunctions.get<User>(`/user`);
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
  userData: {
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
      })
      .addCase(fetchMyNFTs.fulfilled, (state, action) => {
        const currentProfiles = [...(state.profileData.response?.data || [])];
        state.profileData.status = FetchStatus.succeeded;
        state.profileData.response = {
          ...action.payload,
          data: currentProfiles.concat(action.payload.data || []),
        };
      })
      .addCase(fetchMyNFTs.rejected, (state, action) => {
        state.profileData.status = FetchStatus.failed;
        state.listedData.response = undefined;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
    builder
      .addCase(fetchMyListingNFTs.pending, (state) => {
        state.listedData.status = FetchStatus.pending;
      })
      .addCase(fetchMyListingNFTs.fulfilled, (state, action) => {
        state.listedData.status = FetchStatus.succeeded;
        state.listedData.response = {
          ...action.payload,
          data: (state.listedData.response?.data || []).concat(
            action.payload.data || []
          ),
        };
      })
      .addCase(fetchMyListingNFTs.rejected, (state, action) => {
        state.listedData.status = FetchStatus.failed;
        state.listedData.response = undefined;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });

    builder
      .addCase(fetchUser.pending, (state) => {
        state.userData.status = FetchStatus.pending;
        state.userData.response = undefined;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userData.status = FetchStatus.succeeded;
        state.userData.response = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userData.status = FetchStatus.failed;
        const error = action.payload as CommonError;
        toast.error(error?.message);
      });
  },
});

export const { clear } = profileSlice.actions;

export default profileSlice.reducer;
