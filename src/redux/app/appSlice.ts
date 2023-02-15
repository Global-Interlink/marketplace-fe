import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenMenu: false,
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isOpenMenu = !state.isOpenMenu;
    },
    clear: () => initialState,
  },
  extraReducers: (builder) => {},
});

export const { clear, toggleMenu } = homeSlice.actions;

export default homeSlice.reducer;
