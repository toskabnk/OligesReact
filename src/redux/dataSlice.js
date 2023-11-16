import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('data')) || {
    access_token: null,
    isFarmer: null,
    isCooperative: null
};

export const dataSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addData: (state, action) => {
            const {access_token, isFarmer, isCooperative} = action.payload
            state.access_token = access_token;
            state.isFarmer = isFarmer;
            state.isCooperative = isCooperative;
            localStorage.setItem('data', JSON.stringify(state));
        },

        deleteData: (state, action) => {
            state.access_token = null;
            state.isFarmer = null;
            state.isCooperative = null;
            localStorage.removeItem('data');
        }

    }
})

export const {addData, deleteData} = dataSlice.actions;
export default dataSlice.reducer;