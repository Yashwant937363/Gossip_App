import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { apiGetUser, apiSignIn, apiSignUp } from "../../api/client";
import { UserSettings } from "../../types";

export interface UserState {
  profile: string | null;
  fullname: { firstname: string; lastname: string } | null;
  username: string;
  email: string;
  dob: string | null;
  authtoken: string;
  uid: string;
  settings: UserSettings;
  errormsg: string;
  successmsg: string;
  online: boolean;
  isLogin: boolean;
  isPending: boolean;
  requests: any[];
}

const initialState: UserState = {
  profile: "",
  fullname: null,
  username: "",
  email: "",
  dob: null,
  authtoken: "",
  uid: "",
  settings: {
    translation: {
      language: "original",
      alwaysTranslate: false,
    },
    summarization: {
      format: "paragraph",
    },
  },
  errormsg: "",
  successmsg: "",
  online: false,
  isLogin: false,
  isPending: false,
  requests: [],
};

export const signUpUser = createAsyncThunk(
  "user/signupuser",
  async ({ signUpData }: { signUpData: FormData }, { dispatch }) => {
    try {
      const data = await apiSignUp(signUpData);
      if (data?.data?.authtoken) {
        Cookies.set("authtoken", data.data.authtoken, { expires: 365 });
        dispatch(getUser({ authtoken: data.data.authtoken }));
      }
      return { data, status: 200 };
    } catch (error: any) {
      console.log("SignUP Error: ", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      return { data: { error: errMsg }, status: error.response?.status || 500 };
    }
  },
);

export const signInUser = createAsyncThunk(
  "user/signinuser",
  async ({ signInData }: { signInData: any }, { dispatch }) => {
    try {
      const data = await apiSignIn(signInData);
      console.log(data);
      if (data?.data?.authtoken) {
        Cookies.set("authtoken", data.data.authtoken, { expires: 365 });
        dispatch(getUser({ authtoken: data.data.authtoken }));
      }
      return { data, status: 200 };
    } catch (error: any) {
      console.log("SignIn Error: ", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      return { data: { error: errMsg }, status: error.response?.status || 500 };
    }
  },
);

export const getUser = createAsyncThunk(
  "user/getuser",
  async ({ authtoken }: { authtoken: string }) => {
    try {
      const data = await apiGetUser(authtoken);
      return { data, status: 200 };
    } catch (error: any) {
      console.log("GetUser Error: ", error);
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      return { data: { error: errMsg }, status: error.response?.status || 500 };
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: (state) => {
      state.profile = null;
      state.fullname = null;
      state.username = "";
      state.email = "";
      state.dob = null;
      state.authtoken = "";
      state.uid = "";
      state.online = false;
      state.isLogin = false;
      Cookies.remove("authtoken");
    },
    setSignUpDetails: (
      state,
      action: PayloadAction<{
        fullname: any;
        username: string;
        email: string;
        date: string;
        profile?: string | null;
      }>,
    ) => {
      const { fullname, username, email, date } = action.payload;
      state.fullname = fullname;
      state.username = username;
      state.email = email;
      state.dob = date;
    },
    setSignInDetails: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setAuthtoken: (state, action: PayloadAction<string>) => {
      state.authtoken = action.payload;
      if (action.payload) {
        state.isLogin = true;
      }
    },
    setProfile: (state, action: PayloadAction<string>) => {
      state.profile = action.payload;
    },
    setErrorMsgUser: (state, action: PayloadAction<string>) => {
      state.errormsg = action.payload;
    },
    setSucessMsgUser: (state, action: PayloadAction<string>) => {
      state.successmsg = action.payload;
    },
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.online = action.payload;
    },
    changeLanguage: (state, action: PayloadAction<string>) => {
      state.settings.translation.language = action.payload;
    },
    changeAlwaysTranslate: (state, action: PayloadAction<boolean>) => {
      state.settings.translation.alwaysTranslate = action.payload;
    },
    changeSummarizationFormat: (state, action: PayloadAction<string>) => {
      state.settings.summarization.format = action.payload;
    },
    addRequest: (state, action: PayloadAction<any>) => {
      const { uid } = action.payload;
      const exists = state.requests.some((r) => r.uid === uid);
      if (!exists) {
        state.requests.push(action.payload);
      }
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      const fromuid = action.payload;
      const index = state.requests.findIndex((r) => r.uid === fromuid);
      if (index !== -1) {
        state.requests.splice(index, 1);
      } else {
        state.errormsg = "Request not found";
      }
    },
  },
  extraReducers: (builder) => {
    // SignUp User
    builder.addCase(signUpUser.pending, (state) => {
      state.isPending = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      state.isPending = false;
      const { data, status } = action.payload;
      if (status >= 200 && status < 300 && data?.data?.authtoken) {
        state.authtoken = data.data.authtoken;
        Cookies.set("authtoken", action.payload.data.authtoken, {
          expires: 365,
        });
        state.uid = data.user_id || state.uid;
        state.isLogin = true;
      } else {
        state.errormsg = data.error || data.message || "Sign up failed";
      }
    });
    builder.addCase(signUpUser.rejected, (state, action: any) => {
      state.isPending = false;
      state.errormsg = action.error?.message || "Sign up error";
    });

    // SignIn User
    builder.addCase(signInUser.pending, (state) => {
      state.isPending = true;
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      if (action.payload.status < 300 && action.payload.status >= 200) {
        const { profile, authtoken, dob, fullname, uid, username, settings } =
          action.payload.data;
        state.profile = profile;
        state.authtoken = authtoken;
        Cookies.set("authtoken", authtoken, { expires: 365 });
        state.dob = dob;
        state.fullname = fullname;
        state.username = username;
        state.uid = uid;
        state.settings = settings;
        state.isLogin = true;
      } else {
        state.errormsg = action.payload.data.error;
      }
      state.isPending = false;
    });
    builder.addCase(signInUser.rejected, (state, action: any) => {
      state.isPending = false;
      state.errormsg = action.error?.message || "Sign in error";
    });

    // Get User
    builder.addCase(getUser.pending, (state) => {
      state.isPending = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.isPending = false;
      const { data, status } = action.payload;
      if (status >= 200 && status < 300 && data) {
        const user = data.user || data;
        state.username = user.Username || user.username || state.username;
        state.email = user.Email || user.email || state.email;
        state.uid = user.uid || user._id || state.uid;
        state.profile = user.ProfilePicture || user.profile || state.profile;
        if (user.firstname || user.lastname) {
          state.fullname = {
            firstname: user.firstname || "",
            lastname: user.lastname || "",
          };
        }
        if (user.dob) {
          state.dob = user.dob;
        }
        if (user.settings) {
          state.settings = {
            translation: {
              language: user.settings.translation?.language || "original",
              alwaysTranslate: !!user.settings.translation?.alwaysTranslate,
            },
            summarization: {
              format: user.settings.summarization?.format || "paragraph",
            },
          };
        }
        state.isLogin = true;
      } else {
        state.errormsg = data?.error || data?.message;
      }
    });
    builder.addCase(getUser.rejected, (state, action: any) => {
      state.isPending = false;
      state.errormsg = action.error?.message || "Get user error";
    });
  },
});

export const {
  clear,
  setSignUpDetails,
  setSignInDetails,
  setAuthtoken,
  setOnline,
  setProfile,
  setErrorMsgUser,
  setSucessMsgUser,
  addRequest,
  changeLanguage,
  changeAlwaysTranslate,
  removeRequest,
  changeSummarizationFormat,
} = userSlice.actions;

export default userSlice.reducer;
