import { autoBatchEnhancer, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

const getPath = (route) => {
    return `${SERVER_URL}/api/auth/${route}`
}

export const signUpUser = createAsyncThunk("signupuser", async ({ signUpData }) => {
    try {
        const response = await fetch(getPath('signup'), {
            method: 'POST',
            body: signUpData,
        })
        console.log(response.body)
        const data = await response.json();
        return { data: data, status: response.status };
    }
    catch (error) {
        console.log("SignUP Error : " + error)
    }
})

export const signInUser = createAsyncThunk("signinuser", async ({ signInData }) => {
    try {
        const response = await fetch(getPath('signin'), {
            method: 'POST',
            body: signInData,
        })
        // const response = await axios.post(getPath('signin'), signInData);
        console.log(response)
        const data = await response.json();
        return { data: data, status: response.status };
    }
    catch (error) {
        console.log("SignIn Error : " + error)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: '',
        fullname: null,
        username: '',
        email: '',
        dob: null,
        authtoken: '',
        uid: '',
        errormsg: '',
        successmsg: '',
        online: false,
        isLogin: false,
        isPending: false
    },
    reducers: {
        clear: (state, action) => {
            state.profile = null
            state.fullname = null
            state.username = ''
            state.email = ''
            state.dob = null
            state.isLogin = false
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
        setProfile: (state, action) => {
            state.profile = action.payload
        },
        setErrorMsgUser: (state, action) => {
            state.errormsg = action.payload
        },
        setSucessMsgUser: (state, action) => {
            state.successmsg = action.payload
        },
        setOnline: (state, action) => {
            state.online = action.payload
        }
    },
    extraReducers: (builder) => {
        //SignUp User
        builder.addCase(signUpUser.pending, (state, action) => {
            state.isPending = true
        })
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            console.log(action.payload)
            if (action.payload.status < 300 && action.payload.status >= 200) {
                state.authtoken = action.payload.data.authtoken
                state.isLogin = true
            } else {
                state.errormsg = action.payload.data.error
            }
            state.isPending = false
        })
        builder.addCase(signUpUser.rejected, (state, action) => {
            state.isPending = false
            console.log(action.payload)
        })

        //SignIn User
        builder.addCase(signInUser.pending, (state, action) => {
            state.isPending = true
        })
        builder.addCase(signInUser.fulfilled, (state, action) => {
            console.log(action.payload)
            if (action.payload.status < 300 && action.payload.status >= 200) {
                console.log(action.payload)
                const { profile, authtoken, dob, fullname, uid, username, msg } = action.payload.data
                state.profile = SERVER_URL + profile
                state.authtoken = authtoken
                state.dob = dob
                state.successmsg = msg
                state.fullname = fullname
                state.username = username
                state.uid = uid
                state.isLogin = true
            } else {
                state.errormsg = action.payload.data.error
            }
            state.isPending = false
        })
        builder.addCase(signInUser.rejected, (state, action) => {
            state.isPending = false
            console.log(action.payload)
        })
    }
})

export const { clear, setSignUpDetails, setSignInDetails, setOnline, setProfile, setErrorMsgUser, setSucessMsgUser } = userSlice.actions
export default userSlice.reducer