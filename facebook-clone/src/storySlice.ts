import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { StoryRoute } from "../Routes";

export type Story = {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  stories: {
    story_id: string;
    options: {
      background: string;
      font: string;
      caption: string;
      fontColor: string;
    };
    uploaded_time: number;
    photo: string | undefined;
    story_type: string;
    seen: boolean;
  }[];
};

interface initialStoryState {
  isStoryLoading: boolean;
  caption: string;
  font: string;
  background: string;
  photo: string | undefined | ArrayBuffer | null;
  isCreatingTextStory: boolean;
  isCreatingPhotoStory: boolean;
  selectedStory: null | { user: string; story: string };
  story: Story[] | [];
  isStoryPaused: boolean;
  isEditingPhoto: boolean;
  heightOfTheImageContainer: number;
  zoomLevel: number;
  rotate: number;
  isAddingText: boolean;
  currentPage: number;
  translateForPage: number;
  selectedText:
    | {
        caption: string;
        textColor: string;
        font: string;
        editing: boolean;
        id: string;
        fontSize: string;
      }
    | undefined;

  textOptionsForPhoto:
    | {
        caption: string;
        textColor: string;
        font: string;
        editing: boolean;
        id: string;
        draggable: boolean;
        fontSize: string;
      }[]
    | [];
}

const initialState: initialStoryState = {
  caption: "",
  font: "sans serif",
  background: "blue-gradient",
  isCreatingTextStory: false,
  isCreatingPhotoStory: false,
  selectedStory: null,
  story: [],
  photo: undefined,
  isStoryLoading: true,
  isStoryPaused: false,
  isEditingPhoto: false,
  heightOfTheImageContainer: 0,
  zoomLevel: 1,
  rotate: 0,
  isAddingText: false,
  textOptionsForPhoto: [],
  selectedText: undefined,
  currentPage: 1,
  translateForPage: 0,
};
export const getStoryData = createAsyncThunk(
  "story",
  async (userId: string) => {
    const res = await axios.post(StoryRoute, { user: userId });
    const data = res.data;
    return data;
  }
);
export const storySlice = createSlice({
  name: "story",
  initialState: initialState,
  reducers: {
    goToPreviousPage: (state) => {
      state.currentPage -= 1;
      const remainingStories = state.story.length - state.currentPage * 3;

      if (remainingStories >= 3) state.translateForPage += 90;
      if (remainingStories === 2) state.translateForPage += 40;
      if (remainingStories === 1) state.translateForPage += 16;
    },
    goToNextPage: (state) => {
      const remainingStories = state.story.length - state.currentPage * 3;
      state.currentPage += 1;

      if (remainingStories >= 3) state.translateForPage -= 90;
      if (remainingStories === 2) state.translateForPage -= 40;
      if (remainingStories === 1) state.translateForPage -= 16;
    },
    setCaption: (state, action) => {
      state.caption = action.payload;
    },
    setFont: (state, action) => {
      state.font = action.payload;
    },
    setBackgroundColor: (state, action) => {
      state.background = action.payload;
    },
    createTextStory: (state) => {
      state.isCreatingTextStory = true;
    },
    createPhotoStory: (state) => {
      state.isCreatingPhotoStory = true;
    },
    resetState: () => {
      return { ...initialState };
    },
    selectStory: (state, action) => {
      state.selectedStory = action.payload;
    },
    pauseStory: (state) => {
      state.isStoryPaused = true;
    },
    resumeStory: (state) => {
      state.isStoryPaused = false;
    },
    setPhoto: (state, action) => {
      state.photo = action.payload;
    },
    editPhoto: (state) => {
      state.isEditingPhoto = true;
    },
    setHeight: (state, action) => {
      state.heightOfTheImageContainer = action.payload;
    },
    notEditPhoto: (state) => {
      state.isEditingPhoto = false;
    },
    setZoomLevel: (state, action) => {
      state.zoomLevel = action.payload;
    },
    incrementZoomLevel: (state) => {
      if (state.zoomLevel < 4.5) state.zoomLevel += 0.5;
      if (state.zoomLevel >= 4.5 && state.zoomLevel < 5) state.zoomLevel += 0.1;
    },
    decrementZoomLevel: (state) => {
      if (state.zoomLevel > 1) state.zoomLevel -= 0.5;
      if (state.zoomLevel <= 1 && state.zoomLevel > 0.5) state.zoomLevel -= 0.1;
    },
    setRotate: (state) => {
      state.rotate += 90;
    },

    addText: (state) => {
      if (!state.isAddingText) {
        let newData = {
          id: crypto.randomUUID(),
          font: "sans serif",
          caption: "",
          editing: true,
          textColor: "text-white",
          draggable: false,
          fontSize: "1.5rem",
          rotate: 0,
        };
        state.selectedText = newData;
        state.textOptionsForPhoto = [...state.textOptionsForPhoto, newData];
      }
      state.isAddingText = true;
    },

    doneEditingText: (state) => {
      state.isAddingText = false;
      state.textOptionsForPhoto.filter((data) => data.caption !== "");
      state.textOptionsForPhoto.map((data) => {
        data.editing = false;
      });
    },

    setPhotoCaptionTextColor: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload.id
      );
      state.textOptionsForPhoto[index].textColor = action.payload.textColor;
      state.selectedText = state.textOptionsForPhoto[index];
    },

    setPhotoCaptionFont: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload.id
      );
      state.textOptionsForPhoto[index].font = action.payload.font;
      state.selectedText = state.textOptionsForPhoto[index];
    },

    setPhotoCaption: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload.id
      );
      state.textOptionsForPhoto[index].caption = action.payload.caption;
      state.selectedText = state.textOptionsForPhoto[index];
    },

    doneEditingSpecificText: (state) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === state.selectedText?.id
      );
      state.textOptionsForPhoto[index].editing = false;
    },
    editSpecificText: (state, action) => {
      state.isAddingText = true;
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload
      );
      state.textOptionsForPhoto[index].editing = true;
      state.selectedText = state.textOptionsForPhoto[index];
    },

    setSelectedText: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload
      );
      state.selectedText = state.textOptionsForPhoto[index];
    },
    setDraggable: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload
      );
      state.textOptionsForPhoto[index].draggable = true;
    },
    removeDraggable: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload
      );
      state.textOptionsForPhoto[index].draggable = false;
    },
    setPhotoFontSize: (state, action) => {
      const index = state.textOptionsForPhoto.findIndex(
        (data) => data.id === action.payload.id
      );

      const fontSize = action.payload.height / 36;
      state.textOptionsForPhoto[index].fontSize = `${fontSize}rem`;
    },
    removeText: (state, action) => {
      const newTextArray = state.textOptionsForPhoto.filter(
        (text) => text.id !== action.payload
      );
      state.textOptionsForPhoto = newTextArray;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStoryData.fulfilled, (state, action) => {
      state.story = action.payload;
      state.isStoryLoading = false;
    });
  },
});
export const {
  goToNextPage,
  goToPreviousPage,
  setCaption,
  setFont,
  setBackgroundColor,
  createPhotoStory,
  createTextStory,
  resetState,
  selectStory,
  pauseStory,
  resumeStory,
  setPhoto,
  setHeight,
  editPhoto,
  notEditPhoto,
  setZoomLevel,
  decrementZoomLevel,
  incrementZoomLevel,
  setRotate,
  addText,
  doneEditingText,
  setPhotoCaption,
  setPhotoCaptionFont,
  setPhotoCaptionTextColor,
  setSelectedText,
  doneEditingSpecificText,
  editSpecificText,
  setDraggable,
  removeDraggable,
  setPhotoFontSize,
  removeText,
} = storySlice.actions;
export default storySlice.reducer;
