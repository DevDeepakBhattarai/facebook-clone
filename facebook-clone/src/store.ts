import { configureStore } from "@reduxjs/toolkit";
import Setter from "./authSlice";
import storyReducer from "./storySlice";
import profileReducers from "./profileSlice";
import friendSuggestionReducer from "./friendSuggestionSlice";
import postSlice from "./postSlice";

const store = configureStore({
  reducer: {
    auth: Setter,
    profile: profileReducers,
    story: storyReducer,
    friendsForSuggestion: friendSuggestionReducer,
    post: postSlice,
  },
});
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
