import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('user')) || {
    isAuthenticated: false,
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
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(state));
        },

        deleteUser: (state) => {
            state.name = null;
            state.id = null;
            state.isAuthenticated = false;
            localStorage.setItem('user', JSON.stringify(state));
        }

    }
})

export const {addUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;