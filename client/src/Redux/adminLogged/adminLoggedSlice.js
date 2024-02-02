import { createSlice } from "@reduxjs/toolkit";

const adminLoggedSlice = createSlice({
    name:'isadminlogged',
    initialState:{value:false},
    reducers:{
        adminlogged: (state, action) => {
            state.value = action.payload.value
        },
        adminLogout: (state, action) => {
            state.value = false
        }
    }
})

export const { adminlogged, adminLogout } = adminLoggedSlice.actions
export default adminLoggedSlice.reducer
