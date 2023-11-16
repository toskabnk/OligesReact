import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('state')) || {
    name: null,
    id: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action) => {
            const {name, id} = action.payload
            state.name = name;
            state.id = id;
            localStorage.setItem('state', JSON.stringify(state));
        },

        deleteUser: (state, action) => {
            state.name = null;
            state.id = null;
            localStorage.removeItem('state');
        }

    }
})

export const {addUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;