import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('user')) || {
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
            localStorage.setItem('user', JSON.stringify(state));
        },

        deleteUser: (state, action) => {
            state.name = null;
            state.id = null;
            localStorage.removeItem('user');
        }

    }
})

export const {addUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;