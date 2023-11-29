import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('cache')) || {
    farmersCache: [],
    farmersValid: null,
    cooperativesCache: [],
    cooperativesValid: null,
    receiptsCache: [],
    receiptsValid: null,
    farmsCache: [],
    farmsValid: null,
};

export const cacheSlice = createSlice({
    name: "cache",
    initialState,
    reducers: {
        addFarmers: (state, action) => {
            const {farmers, date} = action.payload
            state.farmersCache = farmers;
            state.farmersValid = date;
            localStorage.setItem('cache', JSON.stringify(state));
        },

        addCooperatives: (state, action) => {
            const {cooperatives, date} = action.payload
            state.cooperativesCache = cooperatives;
            state.cooperativesValid = date;
            localStorage.setItem('cache', JSON.stringify(state));
        },

        addReceipts: (state, action) => {
            const {receipts, date} = action.payload
            state.receiptsCache = receipts;
            state.receiptsValid = date;
            localStorage.setItem('cache', JSON.stringify(state));
        },

        addFarms: (state, action) => {
            const {farms, date} = action.payload
            state.farmsCache = farms;
            state.farmsValid = date;
            localStorage.setItem('cache', JSON.stringify(state));
        },

        deleteCache: (state, action) => {
            state.farmersCache = [];
            state.farmersValid = null;
            state.cooperativesCache = [];
            state.cooperativesValid = null;
            state.receiptsCache = [];
            state.receiptsValid = null;
            state.farmsCache = [];
            state.farmsValid = null;
            localStorage.removeItem('cache');
        }
    }
})

export const {addFarmers, addCooperatives, addReceipts, addFarms, addProfile, deleteCache} = cacheSlice.actions;
export default cacheSlice.reducer;