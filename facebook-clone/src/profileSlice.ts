import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FriendsRoute, ProfileRoute } from "../Routes";

export interface Friends {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  noOfMutualFriends: number;
  dataOfMutualFriends: [];
}
interface ProfileState {
  userName: undefined | string;
  userId: undefined | string;
  friends: Friends[];
  isFriendsLoading: boolean;
  profilePicture: undefined | string;
  noOfFriends: undefined | number;
  loading: boolean;
  dateOfBirth: undefined | string;
  isUploadingProfile: boolean;
  zoomLevel: number;
  hasSelectedPicture: boolean;
  isDoneCropping: boolean;
  draggable: boolean;
  description: string;
  accidentallyClicked: boolean;
}

export const getProfileData = createAsyncThunk(
  "profile/getProfileData",
  async (userId: string | string[]) => {
    const res = await axios.post(
      `${ProfileRoute}/getData`,
      { user: userId },
      {}
    );
    return res.data;
  }
);
export const getFriends = createAsyncThunk(
  "profile/getFriends",
  async (userId: string) => {
    const res = await axios.post(FriendsRoute, { userId });
    const data = res.data;
    return data;
  }
);
const initialState: ProfileState = {
  userName: undefined,
  userId: undefined,
  friends: [],
  isFriendsLoading: true,
  zoomLevel: 1,
  profilePicture: undefined,
  noOfFriends: undefined,
  loading: true,
  dateOfBirth: undefined,
  isUploadingProfile: false,
  hasSelectedPicture: false,
  isDoneCropping: false,
  draggable: true,
  description: "",
  accidentallyClicked: false,
};
export const profileSlice = createSlice({
  name: "profile",
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.loading = false;
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.friends = action.payload.friends;
      state.noOfFriends = action.payload.noOfFriends;
    },

    setDescription: (state, action) => {
      state.description = action.payload;
    },
    uploadProfile: (state) => {
      state.isUploadingProfile = true;
    },
    doneUploadingProfile: (state) => {
      state.isUploadingProfile = false;
    },
    profilePicSelected: (state) => {
      state.hasSelectedPicture = true;
    },
    incrementZoomLevel: (state) => {
      if (state.zoomLevel < 5) state.zoomLevel += 0.1;
    },
    decrementZoomLevel: (state) => {
      if (state.zoomLevel > 1) state.zoomLevel -= 0.1;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    Crop: (state) => {
      state.isDoneCropping = !state.isDoneCropping;
      state.draggable = !state.draggable;
    },
    hasAccidentallyClickedClose: (state) => {
      if (state.hasSelectedPicture) state.accidentallyClicked = true;
      else {
        state.hasSelectedPicture = false;
        state.isUploadingProfile = false;
        state.zoomLevel = 1;
        state.accidentallyClicked = false;
      }
    },
    accidentallyClickedClose: (state) => {
      state.accidentallyClicked = false;
    },
    resetUploadingState: (state) => {
      state.hasSelectedPicture = false;
      state.isUploadingProfile = false;
      state.zoomLevel = 1;
      state.accidentallyClicked = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfileData.fulfilled, (state, action) => {
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    });
    builder.addCase(getFriends.fulfilled, (state, action) => {
      console.log(action.payload);
      state.friends = [...state.friends, ...action.payload];
      state.isFriendsLoading = false;
    });
  },
});
export const {
  setData,
  profilePicSelected,
  uploadProfile,
  doneUploadingProfile,
  incrementZoomLevel,
  decrementZoomLevel,
  resetUploadingState,
  Crop,
  setZoomLevel,
  hasAccidentallyClickedClose,
  setDescription,
  accidentallyClickedClose,
} = profileSlice.actions;
export default profileSlice.reducer;
