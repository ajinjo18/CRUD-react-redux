import { createSlice } from '@reduxjs/toolkit'

const userDataSlice = createSlice({
    name:'userData',
    initialState:{value:[]},
    reducers:{
        setUserData: (state, action) => {
            state.value = action.payload.value
        },
        userLogout: (state, action) => {
            state.value = []
        }
    }
})

export const {setUserData,userLogout} = userDataSlice.actions
export default userDataSlice.reducer