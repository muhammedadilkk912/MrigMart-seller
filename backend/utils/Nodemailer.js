const nodemailer=require('nodemailer')
require('dotenv').config()

const transporter=nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    },
});


const sendMail=async(to,otp)=>{
    console.log(transporter)
 
    console.log(otp,to)
     try {
    const info = await transporter.sendMail({
      from: `"PETCARE " <${process.env.EMAIL_USER}>`,
      to,
      subject:'Your OTP Code',
      html: `<p>Your OTP is <strong>${otp}</strong>. It’s valid for 5 minutes.</p>`,
    });
    console.log("✅ Email sent:", info.response);
  } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error
// Throw an error for the caller to catch
        

    // return res.status(500).json({message:"error in sending mail"})
  }

}

module.exports=sendMail

