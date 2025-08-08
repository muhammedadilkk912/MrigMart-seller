const mongoose=require('mongoose')
require('dotenv').config()

let db=process.env.MONGO_URI
// console.log("inside the mongo ",db)

const connectDb=async()=>{
    try {
        await mongoose.connect(db,{  
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
    console.log('mongodb  connected');
    } catch (error) {         
        console.log(error.message); 
        process.exit(1);
          
        
    }
}

module.exports=connectDb