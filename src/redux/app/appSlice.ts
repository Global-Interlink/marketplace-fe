import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenMenu: false,
  success: {
    isOpen: false,
    title: "",
    message: "",
  },
};

export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.isOpenMenu = !state.isOpenMenu;
    },
    clear: () => initialState,
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = initialState.success;
    },
  },
  extraReducers: (builder) => {},
});

export const { clear, toggleMenu, clearSuccess, setSuccess } =
  homeSlice.actions;

export default homeSlice.reducer;
