import { createSlice } from "@reduxjs/toolkit";

const UISlice = createSlice({
    name: 'UIState',
    initialState: {
        openedchat: false
    },
    reducers: {
        changeOpenedChat: (state, action) => {
            state.openedchat = action.payload
        }
    }
})

export const { changeOpenedChat } = UISlice.actions
export default UISlice.reducer