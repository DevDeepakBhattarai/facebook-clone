import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PostsRoute } from "../Routes";
import axios from "axios";

export interface Post {
  user_id: number;
  post_id: string;
  media: [] | string[];
  caption: string;
  uploaded_at: string;
  total_likes: number;
  first_name: string;
  last_name: string;
  profile_pic: string;
  type: string;
  total_comments: number;
  hasLiked: boolean;
  additional_comment: string | undefined;
}
type initialStateType = {
  posts: Post[] | [];
  isPopupForCreatingPostOpen: boolean;
  isAddingPhotos: boolean;
  caption: string;
  photos: [] | string[];
};

const initialState: initialStateType = {
  posts: [],
  isPopupForCreatingPostOpen: false,
  isAddingPhotos: false,
  caption: "",
  photos: [],
};

export const getPosts = createAsyncThunk(
  "post/getPosts",
  async (userId: number) => {
    const res = await axios.get(`${PostsRoute}/${userId}`, {
      withCredentials: true,
    });
    const data = res.data;
    return data;
  }
);
const postSlice = createSlice({
  name: "post",
  initialState: initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    createPost: (state) => {
      state.isPopupForCreatingPostOpen = true;
    },
    doneCreatingPost: (state) => {
      state.isPopupForCreatingPostOpen = false;
    },
    addPhotos: (state) => {
      state.isAddingPhotos = true;
    },
    doneAddingPhotos: (state) => {
      state.isAddingPhotos = false;
    },
    setPhotos: (state, action) => {
      state.photos = [...state.photos, ...action.payload];
    },
    setCaption: (state, action) => {
      state.caption = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
  },
});

export const {
  setPosts,
  createPost,
  doneCreatingPost,
  addPhotos,
  doneAddingPhotos,
  setCaption,
  setPhotos,
} = postSlice.actions;
export default postSlice.reducer;
