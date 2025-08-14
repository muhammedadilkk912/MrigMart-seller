const express=require('express')
const {Registeration,signin,verfiy_otp,resentOtp,forgetpassword,changepasword,
       checkauth
}=require('../controllers/authcontroller')

const router=express.Router()

router.post('/registeration',Registeration)
router.post('/signin',signin)
router.post('/Verify-otp',verfiy_otp)
router.post('/resendotp',resentOtp)
router.post('/forget-password',forgetpassword)
router.put('/changepassword/:email',changepasword)
router.get('/checkauth',checkauth) 
module.exports=router