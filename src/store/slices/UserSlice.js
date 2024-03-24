import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const getPath = (route) => {
  return `${SERVER_URL}/api/auth/${route}`;
};

export const signUpUser = createAsyncThunk(
  "signupuser",
  async ({ signUpData }) => {
    try {
      const response = await fetch(getPath("signup"), {
        method: "POST",
        body: signUpData,
      });
      const data = await response.json();
      return { data: data, status: response.status };
    } catch (error) {
      console.log("SignUP Error : " + error);
    }
  }
);

export const signInUser = createAsyncThunk(
  "signinuser",
  async ({ signInData }) => {
    try {
      const response = await fetch(getPath("signin"), {
        method: "POST",
        body: signInData,
      });
      const data = await response.json();
      return { data: data, status: response.status };
    } catch (error) {
      console.log("SignIn Error : " + error);
    }
  }
);

export const getUser = createAsyncThunk(
  getPath("getuser"),
  async ({ authtoken }) => {
    try {
      const response = await fetch(getPath("getuser"), {
        method: "POST",
        headers: { authtoken },
      });
      const data = await response.json();
      return { data: data, status: response.status };
    } catch (error) {
      console.log("Automatic Login : " + error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: "",
    fullname: null,
    username: "",
    email: "",
    dob: null,
    authtoken: "",
    uid: "",
    errormsg: "",
    successmsg: "",
    online: false,
    isLogin: false,
    isPending: false,
    requests: new Array(),
  },
  reducers: {
    clear: (state, action) => {
      state.profile = null;
      state.fullname = null;
      state.username = "";
      state.email = "";
      state.dob = null;
      state.authtoken = "";
      state.uid = "";
      state.online = false;
      state.isLogin = false;
    },
    setSignUpDetails: (state, action) => {
      const { fullname, username, email, date } = action.payload;
      state.fullname = fullname;
      state.username = username;
      state.email = email;
      state.dob = date;
    },
    setSignInDetails: (state, action) => {
      state.email = action.payload;
    },
    setAuthtoken: (state, action) => {
      state.authtoken = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setErrorMsgUser: (state, action) => {
      state.errormsg = action.payload;
    },
    setSucessMsgUser: (state, action) => {
      state.successmsg = action.payload;
    },
    setOnline: (state, action) => {
      state.online = action.payload;
    },
    addRequest: (state, action) => {
      const { uid, profile, username } = action.payload;
      const requser = state.requests.map((request) =>
        request.uid === uid ? "found" : "notfound"
      );
      if (requser.indexOf("found") !== -1) {
      } else {
        state.requests.push(action.payload);
      }
    },
    removeRequest: (state, action) => {
      const fromuid = action.payload;
      const requser = state.requests.map((request) =>
        request.uid === fromuid ? "found" : "notfound"
      );
      const index = requser.indexOf("found");
      if (index !== -1) {
        let newArr = state.requests.splice(index, 1);
      } else {
        state.errormsg = "Request not found";
      }
    },
  },
  extraReducers: (builder) => {
    //SignUp User
    builder.addCase(signUpUser.pending, (state, action) => {
      state.isPending = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, action) => {
      console.log(action.payload);
      if (action.payload.status < 300 && action.payload.status >= 200) {
        state.authtoken = action.payload.data.authtoken;
        state.uid = action.payload.data.uid;
        Cookies.set("authtoken", action.payload.data.authtoken);
        state.isLogin = true;
      } else {
        state.errormsg = action.payload.data.error;
      }
      state.isPending = false;
    });
    builder.addCase(signUpUser.rejected, (state, action) => {
      state.isPending = false;
      console.log(action.payload);
    });

    //SignIn User
    builder.addCase(signInUser.pending, (state, action) => {
      state.isPending = true;
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      console.log(action.payload);
      if (action.payload.status < 300 && action.payload.status >= 200) {
        console.log(action.payload);
        const { profile, authtoken, dob, fullname, uid, username, msg } =
          action.payload.data;
        state.profile = profile;
        state.authtoken = authtoken;
        Cookies.set("authtoken", authtoken);
        state.dob = dob;
        state.successmsg = msg;
        state.fullname = fullname;
        state.username = username;
        state.uid = uid;
        state.isLogin = true;
      } else {
        state.errormsg = action.payload.data.error;
      }
      state.isPending = false;
    });
    builder.addCase(signInUser.rejected, (state, action) => {
      state.isPending = false;
      console.log(action.payload);
    });

    //Get User
    builder.addCase(getUser.pending, (state, action) => {
      state.isPending = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      const { data, status } = action.payload;
      if (status < 300 && status >= 200) {
        const { user, msg } = data;
        state.successmsg = msg;
        state.username = user.username;
        state.fullname = { firstname: user.firstname, lastname: user.lastname };
        state.email = user.email;
        state.uid = user.uid;
        state.dob = user.dob;
        state.profile = user.profile;
        state.isLogin = true;
      } else {
        state.errormsg = data.error;
      }
      state.isPending = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.errormsg = action.payload;
      console.log(action.payload);
      state.isPending = false;
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
  removeRequest,
} = userSlice.actions;
export default userSlice.reducer;
