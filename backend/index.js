const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const connectDb=require('./config/db')
const cookie_parser=require('cookie-parser')

const authroutes=require('./routes/authroute')
const seller_routes=require('./routes/seller_routes')  

const app=express()
connectDb()

app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookie_parser())
// app.use(express.urlencoded({ extended: true }));
  

app.use(cors({
    origin:process.env.Base_Origin,
    // origin:'https://mrig-mart-seller.vercel.app',
    credentials:true  
}))

dotenv.config()
   

app.use('/api/auth',authroutes)
app.use('/api/seller',seller_routes)
           
const PORT=process.env.PORT || 999

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
}) 
