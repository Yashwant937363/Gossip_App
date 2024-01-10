import { configureStore } from '@reduxjs/toolkit'
import accoutUIReducer from './slices/AccoutUISlice'
import UserSlice from './slices/UserSlice'


export const store = configureStore({
    reducer: {
        accountUI: accoutUIReducer,
        user : UserSlice
    },
})