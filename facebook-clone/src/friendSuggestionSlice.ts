import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FriendsRoute } from "../Routes";

type FriendsSuggestion = {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
};
interface initialState {
  friends: FriendsSuggestion[] | [];
  isDataLoading: boolean;
}

const initialState: initialState = {
  friends: [],
  isDataLoading: true,
};

export const getFriendsForSuggestion = createAsyncThunk(
  "friends/suggestion",
  async (user: string) => {
    const res = await axios.get(`${FriendsRoute}/addFriendSuggestion/${user}`);
    const data = res.data;
    return data;
  }
);

export const friendsForSuggestionSlice = createSlice({
  name: "friends-suggestion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFriendsForSuggestion.fulfilled, (state, action) => {
      state.friends = action.payload;
      state.isDataLoading = false;
    });
  },
});
export default friendsForSuggestionSlice.reducer;
