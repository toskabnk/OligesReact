import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice.js"
import dataReducer from "./dataSlice.js"

export const store = configureStore({
    reducer: {
        user: userReducer,
        data: dataReducer,
    },
})
