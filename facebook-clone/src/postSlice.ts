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
  hasMore: boolean;
  page: number;
  isPopupForCreatingPostOpen: boolean;
  loading: boolean;
  isAddingPhotos: boolean;
  caption: string;
  photos: [] | string[];
};

const initialState: initialStateType = {
  posts: [],
  isPopupForCreatingPostOpen: false,
  page: 1,
  loading: true,
  isAddingPhotos: false,
  hasMore: true,
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

export const getMorePosts = createAsyncThunk(
  "post/getMorePosts",
  async ({ userId, page }: { userId: number; page: number }) => {
    const res = await axios.get(`${PostsRoute}/${userId}?page=${page}`, {
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
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => {
        return post.post_id !== action.payload;
      });
    },
    addMyPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      if (action.payload.length < 1) state.hasMore = false;
      state.posts = action.payload;
      state.loading = false;
    });
    builder.addCase(getMorePosts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMorePosts.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.posts = [...state.posts, ...action.payload];
        state.page = state.page + 1;
        state.loading = false;
      } else {
        state.hasMore = false;
        state.loading = false;
      }
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
  removePost,
  addMyPost,
} = postSlice.actions;
export default postSlice.reducer;
