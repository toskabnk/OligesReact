import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./userSlice.js"
import dataReducer from "./dataSlice.js"
import cacheReducer from "./cacheSlice.js"

export const store = configureStore({
    reducer: {
        user: userReducer,
        data: dataReducer,
        cache: cacheReducer,
    },
})
