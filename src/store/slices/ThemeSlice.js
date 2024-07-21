import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themeMode: "black",
    themeColor: "aqua",
    colorStyle: [
      {
        name: "Red",
        color: "red",
        light: {
          rgbBackground: "255, 217, 217",
          rgbText: "64, 0, 0",
          rgbAccent: "255, 53, 53",
        },
        dark: {
          rgbBackground: "64, 0, 0",
          rgbText: "255, 191, 191",
          rgbAccent: "202, 0, 0",
        },
      },
      {
        name: "Green",
        color: "lime",
        // these values are not of lime
        light: {
          rgbBackground: "64, 0, 0",
          rgbText: "255, 191, 191",
          rgbAccent: "202, 0, 0",
        },
      },
      {
        name: "Blue",
        color: "aqua",
      },
      {
        name: "Pink",
        color: "hotpink",
      },
      {
        name: "Purple",
        color: "blueviolet",
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
  },
});

export const { setThemeMode, setThemeColor } = themeSlice.actions;
export default themeSlice.reducer;
