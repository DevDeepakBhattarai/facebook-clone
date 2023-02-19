import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginRoute } from "../Routes";
interface AuthData {
  isAuth: boolean;
  userName: string | null;
  userId: number | null;
  profile: string | null;
}
let initialState: AuthData = {
  isAuth: false,
  userId: null,
  userName: null,
  profile: null,
};

export const getAuthData = createAsyncThunk("authData", async () => {
  const res = await axios.post(LoginRoute, {}, { withCredentials: true });
  const data = res.data;
  return data;
});

export const authSlice = createSlice({
  name: "Authentication",
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.profile = action.payload.profile;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthData.fulfilled, (state, action) => {
      state.isAuth = action.payload.isAuth;
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.profile = action.payload.profile;
    });
  },
});
export const { setData } = authSlice.actions;
export default authSlice.reducer;
