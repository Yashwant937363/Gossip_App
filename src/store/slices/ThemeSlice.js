import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themeMode: "black",
    themeColor: "aqua",
    colors: {
      rgbBackground: "179, 255, 255",
      rgbText: "0, 59, 59",
      rgbAccent: "0, 255, 255",
    },
    colorStyle: [
      {
        name: "Red",
        color: "red",
        colors: {
          rgbBackground: "255, 179, 179",
          rgbText: "59, 0, 0",
          rgbAccent: "255, 0, 0",
        },
      },
      {
        name: "Green",
        color: "lime",
        colors: {
          rgbBackground: "179, 255, 179",
          rgbText: "0, 59, 0",
          rgbAccent: "0, 255, 0",
        },
      },
      {
        name: "Blue",
        color: "aqua",
        colors: {
          rgbBackground: "179, 255, 255",
          rgbText: "0, 59, 59",
          rgbAccent: "0, 255, 255",
        },
      },
      {
        name: "Pink",
        color: "hotpink",
        colors: {
          rgbBackground: "255, 210, 233",
          rgbText: "59, 24, 41",
          rgbAccent: "255, 105, 180",
        },
      },
      {
        name: "Purple",
        color: "blueviolet",
        colors: {
          rgbBackground: "220, 191, 246",
          rgbText: "32 10 52",
          rgbAccent: "138, 43, 226",
        },
      },
      {
        name: "Yellow",
        color: "yellow",
        colors: {
          rgbBackground: "255, 255, 179",
          rgbText: "59, 59, 0",
          rgbAccent: "255, 255, 0",
        },
      },
    ],
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setThemeColor: (state, action) => {
      state.themeColor = action.payload;
    },
    setColors: (state, action) => {
      state.colors = action.payload;
    },
  },
});

export const { setThemeMode, setThemeColor, setColors } = themeSlice.actions;
export default themeSlice.reducer;
