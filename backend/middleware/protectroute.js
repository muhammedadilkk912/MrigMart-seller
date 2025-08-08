const jwt=require('jsonwebtoken')
require('dotenv').config()

const protectroute=(req,res,next)=>{
    const token=req.cookies.seller_token
    if(!token){
        return res.status(400).json({message:"token expired"})
    }
    const data=jwt.verify(token,process.env.JWT_SECRET)
    // console.log(data)
    req.seller=data
    console.log("inside the protect route")
    next()
}

module.exports=protectroute