const sellerModel =require('../models/seller.model')
const otp_generator =require('otp-generator')
const bcrypt=require('bcrypt')
const sendMail=require('../utils/Nodemailer')
const jwt=require('jsonwebtoken')
const { response } = require('express')

const Registeration=async(req,res)=>{
    console.log("inside auth resogteraion",req.body)
    const {email,name,password,confirmPassword}=req.body
    // console.log(req.body)
    if(!email){
        return res.status(400).json({message:"email is required"})
    }
    if(!name){
        return res.status(400).json({message:"name is required"})
    }
    if(!password || !confirmPassword){
        return res.status(400).json({message:"password is required"})
    }else if(password!==confirmPassword){
        return res.status(400).json({message:"passwords are not equal"})
    }

    try {
        const seller=await sellerModel.findOne({email:email})
        console.log("selller length",seller) 
         
        if(seller){
            console.log("inside the seller")
            if(!seller.isVerified){
                 const hashedpassword=await bcrypt.hash(password,10)
                let otp=otp_generator.generate(4,{ upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
                seller.otp=otp
                seller.name=name
                seller.otpExpire=new Date(Date.now()+5*60000);
                 seller.password=hashedpassword
              
                try {
                    console.log(seller.email,otp)   
                          

                       await sendMail(seller.email,otp)
                       console.log("otp sended successfully")
                } catch (error) {
                                return res.status(400).json({message:"Failed to send OTP email. Please try again."})

                }

                await seller.save()
                return res.status(200).json({message:"otp sented youre registered email"})
            
                                       
            }else{
                return res.status(400).json({ message: "Account already exists." });

           }

        } 
        const hashedpassword=await bcrypt.hash(password,10)

        console.log(hashedpassword)
        const otp=otp_generator.generate(4,{ upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false })
        const otpexpire=new Date(Date.now()+5*60000)
        const newseller=new sellerModel({
            email,
            password:hashedpassword,
            otp,  
            name,
            otpExpire:otpexpire  
  

        })  

        try {
            console.log("inside the sending mail")
            console.log("email=",email,otp)

            
             await sendMail(email,otp)
             console.log("sending mail successfull")

            
        } catch (error) {
            console.log("errorin sendeng mail")
            return res.status(400).json({message:"Failed to send OTP email. Please try again."})
            
        }
          
         await newseller.save()  
         
         console.log(newseller)
        return res.status(200).json({message:"otp sented youre registered email"})
    
    }
        
     catch (error) {
        console.log("error in registeration=",error)
        res.status(500).json({message:"internal server error"})
        
        }

        
     
}
const signin=async(req,res)=>{
    console.log("inside the sign in")
         const {email,password}=req.body
         console.log(email,password);
         
    if(!email.trim()){
       return  res.status(400).json({mesage:"email is required"})
    }
    if(!password.trim()){
       return res.status(400).json({mesage:"password is required"})
    }
    try {
        const seller=await sellerModel.findOne({email,isVerified:true})
        if(!seller){
            return res.status(400).json({message:'No matching account found. Please check your email and try again'})
        }

        const checkpass=await bcrypt.compare(password,seller.password) 
        if(!checkpass){
            return res.status(400).json({message:'invalid pssword'})
        }
         const token = jwt.sign(
            {
           id: seller._id,
           seller: {
          status: seller.status,
           },
         },
           process.env.JWT_SECRET,
           { expiresIn: '5h' }
             );

         // Set the JWT in a cookie
        res.cookie("seller_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // only true in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 5 * 60 * 60 * 1000 // 5 hours
});

        return res.status(200).json({message:"login successfull",status:seller?.status,logo:seller?.logo})

    } catch (error) {
        return res.status(500).json({message:'internal server error'})
        
    }
         


}
const verfiy_otp=async(req,res)=>{
    console.log("inside")
    console.log("response=",req.body)
    const {otp,email}=req.body
    if(!email){
        return res.status(400).json({message:"email not found"})
    }
    if(!otp){
        return res.status(400).json({message:"otp not found it"})
    }

    try {
        const seller = await sellerModel.findOne({ email, otp });

       if (!seller) {
         console.log("inside the checking the seller available");
       return res.status(400).json({ message: "Invalid OTP" });
        } 
 
        console.log(seller)
       const currentTime = new Date();
    if (seller.otpExpire <= currentTime) {
      return res.status(400).json({ message: "OTP has expired" });
     }   
     seller.otp=null;
     seller.otpExpire=null;
     seller.isVerified=true;
     await seller.save()
     return res.status(200).json({message:"otp verfication successfull"})
    } catch (error) {
        console.log("verify otp",error)
        return res.status(500).json({message:"internal server error"})
        
    }
  
}

const resentOtp=async(req,res)=>{

    const {email}=req.body
    if(!email)
    {
        res.status(400).json({message:"email not found"})
    }

    try {
        const seller=await sellerModel.findOne({email})
        if(!seller){
            return res.status(400).json({message:"No account found with that email"})

        }
          seller.otp=otp_generator.generate(4,{ upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false });
          seller.otpExpire=new Date(Date.now()+5*60000);
          await sendMail(email,otp)
          await seller.save()
          res.status(200).json({message:'resend otp to registered email'})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
        
    }
    
}
const forgetpassword=async(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.status(400).json({message:"email not found"})
    }

    try {
        const seller=await sellerModel.findOne({email:email,isVerified:true})
        if(!seller){
                        return res.status(400).json({message:"No account found with that email"})

        }
        let otp=otp_generator.generate(4,{ upperCaseAlphabets: false,lowerCaseAlphabets:false, specialChars: false })
        seller.otp=otp
        seller.otpExpire=new Date(Date.now()+5*60000);

        try {
            await sendMail(email,otp)
        } catch (error) {
                      return res.status(400).json({message:"Failed to send OTP email. Please try again."})

            
        }
        await seller.save()
       return res.status(200).json({message:"email verification successfull"})
        
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
        
    }
}

const changepasword=async(req,res)=>{
    console.log("inside")

    const {email}=req.params 
    console.log(req.params)
    console.log("email=",email)  
    
    const{password,confrimPassword}=req.body
    if(!email){
        return res.status(400).json({message:"email not found"})
    }
    if(!password || !confrimPassword){
        return res.status(400).json({message:'password not found'})

    }
    if(password!==confrimPassword){
        return res.status(400).json({message:'password are not equal'})
    }

    try {
        const seller=await sellerModel.findOne({email})
        if(!seller){
            return res.status(400).json({message:"not found account with that email"})
        }
            const hashedpassword=await bcrypt.hash(password,10)

        seller.password=hashedpassword;
        await seller.save()
        res.status(200).json({message:'password updated successfully'})
    } catch (error) {
        return  res.status(500).json({message:'internal server error'})
        
    }
    


}   

const checkauth=async(req,res)=>{
    console.log("inside the check auth")
    const token =req?.cookies?.seller_token
    console.log("token=",token)
    if(!token){
        return res.status(400).json({message:'token expired'})
    }
    const seller=jwt.verify(token,process.env.JWT_SECRET)
    console.log('seller=',seller) 
    let status
    try {
        const res=await sellerModel.findOne({_id:seller.id})
        console.log("response=",res)  
        status=res.status
    } catch (error) {
        return res.status(500).json({message:"internal server error"})
        
    }
    res.status(200).json({message:"atuhentication checking successfull",status})

}

module.exports={Registeration,signin,verfiy_otp,resentOtp,forgetpassword,changepasword,
    checkauth
}  