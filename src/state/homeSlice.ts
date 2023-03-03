import { createSlice } from "@reduxjs/toolkit";
const homeSlice = createSlice({
  name: "home",
  initialState: {
    isLoading: true,
    isMobileNavBarOpen: false,
  },
  reducers: {
    doneLoading: (state) => {
      state.isLoading = false;
    },
    openMobileNavBar: (state) => {
      state.isMobileNavBarOpen = true;
    },
    closeMobileNavBar: (state) => {
      state.isMobileNavBarOpen = false;
    },
  },
});
export const { doneLoading, openMobileNavBar, closeMobileNavBar } =
  homeSlice.actions;
export default homeSlice.reducer;
