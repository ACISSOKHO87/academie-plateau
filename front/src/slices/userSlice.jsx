import { createSlice } from "@reduxjs/toolkit";

// initialisation du userSlice
const initialState = {
    infos: {},
    isLogged: false
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, action) =>{
            state.infos = action.payload
            state.isLogged = true
        },
        logoutUser: (state) =>{
            state.infos = {}
            state.isLogged= false
        }
    }
})

export const { loginUser, logoutUser } = userSlice.actions
export const selectUser = (state) => state.user
export default userSlice.reducer