import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        isLogin : false,
    },
    reducers : {

    }
})

const {} = userSlice.actions
export default userSlice.reducer