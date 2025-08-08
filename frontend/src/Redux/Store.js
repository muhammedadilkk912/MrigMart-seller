import LoadSlic from './LoadingSlic'
import authSlic from './authSlic'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    auth: authSlic,
    loading:LoadSlic  

  
   
  },
});
export default store

