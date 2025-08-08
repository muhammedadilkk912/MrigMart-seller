import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import  store  from  './Redux/Store.js'
import {Provider} from 'react-redux'
 import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
    <BrowserRouter> <App /></BrowserRouter>
   
  </StrictMode>,

  </Provider>
  
)
