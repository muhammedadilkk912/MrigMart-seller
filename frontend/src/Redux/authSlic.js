import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:'auth',
    initialState:{
        isAuthenticate:false,
        status:null,
        logo:null
    },

    reducers:{
        login(state,action){
            state.isAuthenticate=true,
            state.status=action.payload

        },
        setAuthentication(state,action){
              state.isAuthenticate=true,
            state.status=action.payload
        },
        Logout(state,action){
            console.log("inside the ")
            state.isAuthenticate=false,
            state.status=null
        },
        setLogo(state,action){ 
            console.log("payload=",action.payload)
            state.logo=action.payload
        },
        setStatus(state,action){
            state.status='pending'
        }
    }
})
  
export const{login,setAuthentication,Logout,setLogo,setStatus}=authSlice.actions;
export default authSlice.reducer;