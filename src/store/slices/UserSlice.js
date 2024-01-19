import { autoBatchEnhancer, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_API_SERVER_URL

const getPath = (route) => {
    return `${SERVER_URL}/api/auth/${route}`
}

export const signUpUser = createAsyncThunk("signupuser", async ({ signUpData }) => {
    try {
        const response = await fetch(getPath('signup'),{
            method : 'POST',
            body : signUpData,
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },        
        })
        console.log(response)
        const data = response.data;
        return { data: data, status: response.status };
    }
    catch (error) {
        console.log("SignUP Error : " + error)
    }
})

export const signInUser = createAsyncThunk("signinuser", async ({ signInData }) => {
    try {
        const response = await axios.post(getPath('signup'), signInData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const data = response.data;
        return { data: data, status: response.status };
    }
    catch (error) {
        console.log("SignIn Error : " + error)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        fullname: null,
        username: '',
        email: '',
        dob: null,
        authtoken: '',
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
        setProfile: (state, action) => {
            state.profile = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signUpUser.pending, (state, action) => {
            state.isPending = true
        })
        builder.addCase(signUpUser.fulfilled, (state, action) => {
            console.log(action.payload)
            if (action.payload.status < 300 && action.payload.status >= 200) {
                state.authtoken = action.payload.data.authtoken
            } else {
            }
            state.isPending = false
        })
        builder.addCase(signUpUser.rejected, (state, action) => {
            state.isPending = false
            console.log(action.payload)
        })
    }
})

export const { clear, setSignUpDetails, setProfile } = userSlice.actions
export default userSlice.reducer