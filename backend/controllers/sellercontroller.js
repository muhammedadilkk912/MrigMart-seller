const uploadToCloudinary=require('../middleware/uploadCloudinary')
const sellerModel = require('../models/seller.model')
const categoryModel=require('../models/category.model')
const uploadBufferToCloudinary=require('../middleware/UploadtoBuffer')
const productModel=require('../models/product.model')
const bannerModel=require('../models/banner.model')
const cloudinary=require('cloudinary').v2
const orderModel =require('../models/order.model')
const mongoose=require('mongoose')
const reviewModel = require('../models/review.model')
const delicalculateDeliveryDate  =require('../utils/deliveryDate')
// const { json } = require('express')


const registeration=async(req,res)=>{
    const {data}=req.body    
   
    const newData=JSON.parse(data)
    if(!newData){
        return res.status(400).json({message:"value are not found"})
    }
   
   let logo
    
    try {
        const seller=await sellerModel.findOne({_id:req.seller.id})
        console.log(seller)
        if(req.file){
        const result=await uploadToCloudinary(req.file.buffer,'business-logo',seller._id)
        logo=result.secure_url
        console.log("resutl=",result)
      
        
    }
     if(seller&&seller.status!=='pre-registration'){
        return res.status(400).json({message:"already have an account"})
     }
     seller.businessName=newData.businessName,
     seller.businessType=newData.businessType,
     seller.address.street=newData.address.street,
     seller.address.city=newData.address.city,
     seller.address.district=newData.address.district,
     seller.address.state=newData.address.state,
     seller.address.country=newData.address.country,
     seller.address.pin=newData.address.pin,
     seller.bankDetails.accountHolderName=newData.banking.accountName,
     seller.bankDetails.accountNumber=newData.banking.accountNumber,
     seller.bankDetails.bankName=newData.banking.bankName,
     seller.bankDetails.branch=newData.banking.branch,
     seller.bankDetails.ifscCode=newData.banking.ifscCode,
     seller.status='pending'
      seller.logo=logo
     await seller.save()
     res.status(200).json({message:"yore registeration is successfull and processing.."})



        
    } catch (error) {
        console.log("error in registeration=",error)
        return res.status(500).json({message:"internal server error"})
        
    }
     
}
const logout=(req,res)=>{
 
    
       res.clearCookie('seller_token', {    
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  // must match cookie options from login
      // must match
        path: '/',          // must match
      });
      res.status(200).json({message:"logout successfully completed"})

}
const getcategory=async(req,res)=>{
    try {
        const category=await categoryModel.find()
        if(category.length===0){
            res.status(400).json({message:"category not getting in db"})
        }
        res.status(200).json({message:"category got it",category})
    } catch (error) {
        console.log("response in getcategory",error)
        res.status(500).jsonP({message:"intrnal server error"})
        
    }
}

const addproduct=async(req,res)=>{
    console.log("images=",req.files);
    
    
    let {product,dynamicfields}=req.body
    product=JSON.parse(product)
    dynamicfields=JSON.parse(dynamicfields)
    console.log(product,dynamicfields)
    if(!product || !dynamicfields){
   return  res.status(400).json({message:"product details didnot got it"})
    }console.log("length =",req.files.length)
    if(req.files.length==0){
        console.log("inside the req.files=",req.files)
       return res.status(400).json({message:'images not got it'})

    }
       let discountprice = Math.round(product.price - (product.price * product.discount) / 100);
       console.log("discountprice=",discountprice)

       try {
         const uploadPromises = req.files.map(file =>
      uploadBufferToCloudinary(file.buffer)
    );
         const image_res=await Promise.all(uploadPromises)
         console.log("image urls=",image_res)
         const products =new productModel({
            name:product.name,
            description:product.description,  
            price:product.price,
            discount:product.discount,
            discountprice:discountprice,
            stock:product.stock,
            status:product.status,
            images:image_res,
            core_details:dynamicfields,
            category:product.category,  
            addedBY:req.seller.id,
            isAdmin:false
         })
         await products.save()
         res.status(200).json({message:"product added successfully"})
       } catch (error) {
        console.log("error in add product=",error)
        return res.status(500).json({message:"internal server error"})
        
       }


      




}

const getproducts=async(req,res)=>{
     console.log(req.query)
     const {page}=req.params
    const{search,datefilter,category,price}=req.query
    let skip=(page-1)*10
    console.log("skip=",skip)

    try {
        let query={addedBY:req.seller.id}
        let sortOption={}
        if(search){
            query.name={
                $regex:search,$options:'i'
            }
        }
        if(price){
            if(price==='low'){
                sortOption.discountprice=1
            }else{
                
                sortOption.discountprice=-1
            }
        }
        if (datefilter === 'Oldest') sortOption.createdAt = 1;
    else if (datefilter === 'Newest') sortOption.createdAt = -1;
        if(category){
            query.category=category
        }


        console.log(query);
        const products =await productModel
        .find(query)
        .populate('category','category')
        .sort(sortOption)
        .skip(skip)
        .limit(10)

        
        
        
       
      
        if(!products){
            return res.status(400).json({message:"product no found"})
        }
            const totalusers=await productModel.countDocuments({addedBY:req.seller.id })
            const totalpage=Math.ceil(totalusers / 10)
            console.log("total users=",totalusers)

        
        console.log("product.length",products.length)

        res.status(200).json({message:"product got it",products,totalusers,totalpage})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
}

const getproduct_id=async(req,res)=>{
    const {id}=req.params
    console.log(id)
    if(!id){
        return res.status(400).json({message:"id not got it"})
    }

    try {
        const product=await productModel.findById(id)
        res.status(200).json({message:"product gotit",product})
    } catch (error) {
        res.status(500).json({message:"internal server error"})
    }
}  
const updateproduct=async(req,res)=>{  
    console.log("inside update the product")
    const {id}=req.params
    let {product,dynamicfields,deleteimage}=req.body
    console.log("the body=",req.body)
    console.log(id)
    console.log(req.files)
    
     try {
        const oldproduct=await productModel.findOne({_id:id})
        if(!oldproduct){
            return res.status(400).json({message:"product not found"})        
        }
        
        let existingImages=oldproduct?.images
      
        console.log(oldproduct)
        console.log(existingImages)
        if(req.files && req.files.length>0){
        const uploadPromises = req.files.map(file =>
      uploadBufferToCloudinary(file.buffer)
    )
         const image_res=await Promise.all(uploadPromises)
         console.log('images_res',image_res)
        //  updateQuery.$push={images:{$each:image_res}}
       image_res.forEach(val => {
        if(!existingImages.includes(val)){
            existingImages.push(val)
        }else{
            console.log("inside the duplicate check")
            return res.status(400).json({message:'duplicate image not allowed'})
        }
        
       });
  
    }
    if(deleteimage?.length>0){
       existingImages=existingImages.filter((val)=>!deleteimage.includes(val))
    }
    console.log("images=",existingImages)
    let field={}
    if(deleteimage?.length>0 || req?.files?.length>0){
        field.images=existingImages
    }
    if(product){
         product=JSON.parse(product)
         const discountprice = Math.round(
        product.price - (product.price * product.discount) / 100
      );
      
      field={
        ...field,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        discountprice,
        status: product.status,
        category: product.category,
       

      }
    }
    if(dynamicfields){
        dynamicfields=JSON.parse(dynamicfields)
        field.core_details=dynamicfields

    }
    let updateQuery={}
     if(Object.keys(field).length>0){
        updateQuery.$set=field
    }
    console.log("update query=",updateQuery)
   
      if (Object.keys(updateQuery).length > 0) {
        console.log("update query=",Object.keys(updateQuery))
      const result = await productModel.updateOne({ _id: id }, updateQuery);
         console.log("Updated successfully:", result);
         return res.status(200).json({messge:"updated successfully"})
      }

     
    // try {
        
    //            if (Object.keys(updateQuery).length > 0) {
    //   const result = await productModel.updateOne({ _id: id }, updateQuery);
    //   console.log("Update result:", result);
        
    // }
        

    

     } catch (error) {
        console.log("error in product update=",error)
        return res.status(500).josn({message:"internal server error"})
        
     }
     }

     const getprofile=async(req,res)=>{
        try {
            const profile=await sellerModel.findById(req.seller.id)
            console.log(profile)
            return res.status(200).json({message:"profile fetched successfully",profile})
        } catch (error) {
            console.log('error in get profile=',error)
            return res.status(500).json({message:"internal server eroror"})
            
        }
     }
  const updateprofile=async(req,res)=>{   
    console.log("update profile=")
       
    console.log(req?.file)
    console.log(req.body)  
    let {profile,bank,address} =req.body
    let obj={}
     if(profile){
        profile=JSON.parse(profile)
        obj = { ...obj, ...profile };
    }
    if(req.file){
        const result= await uploadToCloudinary(req.file.buffer)
        console.log("image result=",result)
        obj.logo=result.secure_url 
          
    }    
    
   
    if(bank){
        bank=JSON.parse(bank)
        obj.bankDetails=bank               
        // obj={...obj,bankbankDetails:bank}
    }
    if(address){
        address=JSON.parse(address)
        obj.address=address
        // obj={...obj,address:address}
    }
    
    console.log("updated data=",obj);
    let query = {};
if (Object.keys(obj).length > 0) {
  query.$set = obj;
}
try {
    if(Object.keys(query).length > 0){
     const seller =await sellerModel.updateOne({_id:req.seller.id},query)
     res.status(200).json({message:"profile updated successfull"})


    }
} catch (error) {
    console.log("error in profile update",error)
    return res.status(500).json({messsage:"internal server error"})
    
}
    // console.log("profile",profile)  
    // console.log('insid t update profile')
  }
  const banner=async(req,res)=>{
    console.log(req.seller.id)
    try {
        const products=await productModel.find({addedBY:req.seller.id})
        // console.log(products)
        const banners=await bannerModel.find({addedby:req.seller.id})
        res.status(200).json({message:'products got it',products,banners}) 
    } catch (error) {
        res.status(500).json({message:'internal server error'})
        
    }

  }

  const add_banner=async(req,res)=>{
    console.log("inside the add banner") 
    // console.log("Add banner",req.body)
    const {image,link,isActive}=req.body
    console.log(image)
    console.log(isActive,"=",link)
    

    if(!image){
        return res.status(400).json({message:'banner detail not got it'})
    }
    
  
//   console.log("data=",data)
    try {

         const result = await cloudinary.uploader.upload(image, {
      folder: 'banner',
    });
    console.log(result)
    

        const banner=new bannerModel({
            addedby:req.seller.id,
            image:result.secure_url,
            link:link || '',
            isActive:isActive,
            status:isActive?"Pending":'Inactive',
            addedbymodel:'seller'
        })
        await banner.save()
        return res.status(200).json({message:"banner added successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
        
    }
  }
  const delete_banner=async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(400).json({message:"id not found"})
    }
    try {
        const banner=await bannerModel.deleteOne({_id:id})
        return res.status(200).json({message:"banner deleted successfull"})
    } catch (error) {
        return res.status(500).json({message:'internal server error'})
        
    }

}
const update_banner=async(req,res)=>{
    const {id}=req.params
    // console.log(req.body,id)
    const {link,isActive,image}=req.body
    console.log("inside the update banner")
    console.log
    if(!id){
        return res.status(400).json({message:"id not found"})
    }
    // if(! link || !isActive || !image){
    //     return res.status(400).json({message:'update details not got'})
    // }
    let query={}
    if(link){
        query.link=link
    } if(isActive){
        query.isActive=isActive
    }if(image){
        console.log('inside image upload')
         const result = await cloudinary.uploader.upload(image, {
      folder: 'banner',
    });
    console.log(result)
        query.image=result.secure_url
    }
    console.log(query)
    if(Object.keys(query).length < 0){
        return res.status(400).json({message:"update detail not found"})
    }

    try {
        const banner=await bannerModel.findById(id)
        if(!banner){
            return res.status(400).json({message:'banner not found'})
        }    
        console.log(query)
        const update_banner=await bannerModel.updateOne({_id:id},{
            $set:query
        })
        return res.status(200).json({message:"update banner successfull"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error "})
    }
}

const getOrders=async(req,res)=>{
    const {page}=req.params
    console.log(req.seller.id)
    const{status,filterdate,search}=req.query
        const now = new Date();
    const query = {};
     if (filterdate && filterdate !== 'all-time') {

      if (filterdate === 'today') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      } else if (filterdate === 'week') {
        const start = new Date(now.setDate(now.getDate() - now.getDay()));
        start.setHours(0, 0, 0, 0);
        const end = new Date(now.setDate(start.getDate() + 6));
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      } else if (filterdate === 'month') {
        const year = now.getFullYear();
        const month = now.getMonth();
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }
    }
    console.log(page,filterdate,status)
   

    try {
       const orders = await orderModel.aggregate([
   {$unwind:'$items'} ,{
  $match: {
    'items.sellerId': new mongoose.Types.ObjectId(req.seller.id)
  }
},
{$match:query},
  // Step 3: Unwind products inside that seller's items
  { $unwind: '$items.products' },
 ...(status !== 'all' && status !==undefined ?[
    {
        $match:{'items.products.status':status}
    }
 ]:[]),
  

  // Step 4: Lookup product details
  {
    $lookup: {
      from: 'products',
      localField: 'items.products.productId',
      foreignField: '_id',
      as: 'productDetails'
    }
  },
  { $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true } },
  ...(search?[
    {
        $match:{
            'productDetails.name':{$regex:search , $options:'i'}
        }
    }
  ]:[]),
  {
    $lookup:{
        from:'users',
        localField:'user',
        foreignField:'_id',
        as:'user'
    }
},{
    $unwind:'$user'
},
{
    $project:{
        _id:'$_id',
        mobile:'$mobile',
        address:'$address',
        user:{
            _id:'$user._id',
            name:'$user.username'
        },
        items:{
            sellerid:'$items.sellerId',
            product:'$productDetails',
            quantity:'$items.products.quantity',
            price:'$items.products.price',
            status:'$items.products.status',
            
        },
        createdAt:'$createdAt',
        deliveryDate:'$items.products.deliveryDate'

    }
} ]);
console.log(orders)
console.log(orders.length)

const totalCount = await orderModel.aggregate([
  { $unwind: "$items" },
  { $match: { "items.sellerId": new mongoose.Types.ObjectId(req.seller.id) } },
  { $match: query }
  ,{
     $unwind:'$items.products'
  }
  ,
  ...(status !== 'all' && status !== undefined ? [
    { $match: { "items.products.status": status } }
  ] : [])
  ,
  ...(search ? [
    {
      $lookup: {
        from: 'products',
        localField: 'items.products.productId',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    { $unwind:"$productDetails" },
    {
      $match: {
        "productDetails.name": { $regex: search, $options: "i" }
      }
    }
  ] : [])
  ,     
  { $count: "total" }    
]);
console.log("total count=",totalCount)
console.log("length",totalCount.length)    
let totalcount=totalCount[0]?.total || 0
const totalPage=Math.ceil(totalcount/10)


        // console.log(orders)
        res.status(200).json({message:"orders got it",orders,totalPage,page})
    } catch (error) {
        console.log(error)

    }
    
}

const changeorderstatus=async(req,res)=>{
    const {id}=req.params
    
    if(!id){
        return res.status('order id not found')
    }
    const {productId,status}=req.query
    console.log("cancelled",status)
    if(!productId){
        return res.status('product id not found')
    }
    if(!status){
        return res.status('new status not found')
    }

    const update = {
  $set: {
    'items.$[item].products.$[product].status': status
  }
};
if (status === 'shipped') {
  
      let date=new Date()
    let  del_date=delicalculateDeliveryDate(date,4)
      console.log("delivery date=",del_date)
      update.$set['items.$[item].products.$[product].deliveryDate'] = del_date;
   
}

if (status === 'cancelled') {
  update.$set[
    'items.$[item].products.$[product].deliveryDate' ]= null
 ;
}
  console.log("update=",update)


    try {
       const orders = await orderModel.updateOne(
  {
    _id: id,
    'items.sellerId': req.seller.id,
    'items.products.productId': productId
  },
  update,
  // {
  //   $set: {
  //     'items.$[item].products.$[product].status': status,
  //     'items.$[item].products.$[product].deliveryDate':(status !=='delivered' && status === 'shipped') && del_date

  //   }
  // },
  {
    arrayFilters: [
      { 'item.sellerId': req.seller.id },
      { 'product.productId': productId }
    ]
  }
);

    console.log(orders)
    res.status(200).json({message:'status updated successfull'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
    
    
}

const order_detailpage=async(req,res)=>{
    const{id,productId}=req.params
    console.log(id,productId)

   const order = await orderModel.aggregate([
  { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the order by ID
  { $unwind: "$items" } ,// Flatten the products array
  {$unwind:'$items.products'},
  {$match:{'items.products.productId':new mongoose.Types.ObjectId(productId)}},{
    $lookup:{
        from:'products',
        localField:'items.products.productId',
        foreignField:'_id',
        as:'product'
    }
  },{
    $unwind:'$product'
  },{
     $lookup:{
        from:'users',
        localField:'user',
        foreignField:'_id',
        as:'user'
    }

  },{
    $unwind:'$user'
  },
  {
    $project: {
      _id: 1,
      orderDate: 1,
      user:1,
      product:1,
            address: 1,
      mobile: 1,
      createdAt:1,
      paymentStatus:1,
      
      // Include only the matched product info

    "items.products": 1 ,
    "items.sellerId": 1
        
    }
  }
]);

    console.log(order)
    res.status(200).json({message:'order got it',Order:order[0]})
}
const getReviews=async(req,res)=>{
    const {page}=req.params
    const limit=10
    const skip=(Number(page)-1)*limit
    const{status,rating}=req.query
    console.log(status,rating)   
      
    try {
        const reviews=await reviewModel.aggregate([
            ...(rating !== 'all' ?[
                {
                    $match:{'rating':Number(rating)}
                }
            ]:[]

            ),
            ...(status !== 'all' ?[
                {
                    $match:{'status':status}
                }
            ]:[]

            ),
            
            { 
                $lookup:{
                    from:'products',
                    localField:'product',
                    foreignField:'_id',
                    as:'product'

                }
            },{
                $unwind:'$product'
            },{
                $match:{'product.addedBY':new mongoose.Types.ObjectId(req.seller.id)}
            },{
                $lookup:{
                    from:'users',
                    localField:'user',
                    foreignField:'_id',
                    as:'user'

                }
            },{
                $unwind:'$user'
            },
            {
                $skip:skip
            },{
                $sort:{createdAt:-1}
            },{
                $limit:limit
            }
        ])

        
        console.log(reviews)
        const matchStage = {};
if (status !== 'all') matchStage.status = status;
if (rating !== 'all') matchStage.rating = Number(rating);
console.log(matchStage)

const countdocument = await reviewModel.aggregate([
  ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
  {
    $lookup:{
        from:'products',
        localField:'product',
        foreignField:'_id',
        as:'productDetails'
    }
  },{
    $unwind:'$productDetails'
  },{
      $match:{'productDetails.addedBY':new mongoose.Types.ObjectId(req.seller.id)}
  },
  { $count: 'total' }
]);

console.log(countdocument)
 const totalCount = countdocument[0]?.total || 0;
 const totalpage=Math.ceil(totalCount/10)

        res.status(200).json({message:'reviews got it successfully',reviews,totalpage})
    } catch (error) {
        consol.log(error)
        res.status(500).json({message:'reviews got it successfully'})
    }
    
}

const delteReview=async(req,res)=>{
    const {id}=req.params
    if(!id){
        return res.status(40).json({message:"it not found"})
    }
    try {
        const review=await reviewModel.deleteOne({_id:id})
        res.status(200).json({message:'deleted successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).josn({message:'internal server error'})
    }
}
const change_review_status=async(req,res)=>{
    const {id,status}=req.params
    
    if(!id){
        return res.status(40).json({message:"it not found"})
    }
    if(!status){
        return res.status(400).json({message:"status not found"})
    }
    try {
        const review=await reviewModel.updateOne({_id:id},{
            $set:{
                status:status
            }
        })
        console.log(review)
        res.status(200).json({message:'status updated successfull'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }

}
const getcustomers=async(req,res)=>{
    const {page}=req.params
    const limit=10
    const skip=(Number(page)-1)*limit
    const {status,search}=req.query
    console.log(status,search)
    
    try {
        const customers = await orderModel.aggregate([
  // Unwind the items array to access seller info
  { $unwind: '$items' },

  // Filter orders to only include those with this seller
  {
    $match: {
      'items.sellerId': new mongoose.Types.ObjectId(req.seller.id)
    }
  },

  // Join with users collection to get customer info
  {
    $lookup: {
      from: 'users',
      localField: 'user', 
      foreignField: '_id',
      as: 'customer'
    }
  },
  { $unwind: '$customer' },
  ...(search ? [
    {
        $match:{'customer.username':{$regex:search,$options:'i'}}
    }
  ]:[]),
  ...(status !== 'all' ?[
    {
        $match:{'customer.status':status}
    }
  ]:[]

  ),

  // Group by user to avoid duplicates
  {
    $group: {
      _id: '$customer._id',
      name: { $first: '$customer.username' },
      email: { $first: '$customer.email' },
      phone: { $first: '$customer.phone' },
      logo:{$first:'$customer.profile'},
      status:{$first:'$customer.status'},
      totalOrders: { $sum: 1 },
      date:{
        $first:'$customer.createdAt'
      }
    }
  },{
    $sort:{date:-1}
  },{
    $skip:skip
  },{
    $limit:limit
  }
]);
console.log("customer",customers)
const countdocument=await orderModel.aggregate([
    {
        $unwind:'$items'
    },{
        $match:{'items.sellerId':new mongoose.Types.ObjectId(req.seller.id)}
    },{
    $lookup: {
      from: 'users',
      localField: 'user', 
      foreignField: '_id',
      as: 'customer'
    }
  },
  { $unwind: '$customer' },
  ...(status !== 'all'?[
    {
        $match:{'customer.status':status}
    }
  ]:[]),{
    $count:'total'
  }
])
console.log(countdocument)
const totalcount=countdocument[0]?.total || 0
const totalpage=Math.ceil(totalcount/limit)
res.status(200).json({message:'fectch customer details',customers,totalpage})

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}
const productDetailpage=async(req,res)=>{
    const {id}=req.params
    try {
        const products=await productModel.aggregate([
            {
                $match:{_id:new mongoose.Types.ObjectId(id)} 
            },{
                $lookup:{
                    from:'categories',
                    localField:'category',
                    foreignField:'_id',
                    as :'category'

                }
            },{
                $unwind:'$category'
            },{
              $lookup:{
                from:'orders',
                let:{productId:'$_id'},
                pipeline:[
                  {
                    $unwind:'$items'
                  },{
                    $unwind:'$items.products'
                  },{
                    $match:{
                      $expr:{
                        $eq:['$$productId','$items.products.productId']
                      }
                    }
                  },{
                    $group:{
                      _id:null,
                      totalAmount:{$sum:'$items.products.price'}
                    }
                  }
                  
                ],
                 as: 'productorder'
              }
            },
            {
    $addFields: {
      totalSales: {
        $ifNull: [{ $arrayElemAt: ['$productorder.totalAmount', 0] }, 0]
      }
    }
  },
  {
              $project:{

             
              _id:'$_id',
              product:{
                name:'$name',
                description:'$description',
                price:'$price',
                discount:'$discount',
                discountprice:'$discountprice',
                images:'$images',
                status:'$status',
                stock:'$stock',
              },

                category:'$category.category',
                core_details:'$core_details',
                totalSales:1,
                sold:'$sold'
            }
              
            }
        ])
        console.log("prodcut=",products) 
        let product=products[0]  
        res.status(200).json({message:'product detaips got it',product})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const getcardDetails=async(req,res)=>{
    console.log("inside the car details")
      const sellerId = new mongoose.Types.ObjectId(req.seller.id);
      

    try {
        const revenue = await orderModel.aggregate([
            {
                $unwind: '$items'
            }, {
                $match: { 'items.sellerId': sellerId }
            }, {
                $unwind: '$items.products'
            }
            , {
                $group: {
                    _id: null,
                   
                    totalsales: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: ['$items.products.status', 'delivered']
                                },
                                '$items.products.price',
                                0
                            ]
                        }
                    },
                    totalProductOrders: { $sum: 1 },
                    pendingorders: {
                        $sum: {
                            $cond: [
                                {
                                    $not: {
                                        $in: ['$items.products.status', ['delivered', 'cancelled']]
                                    }
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }

        ])

        const distinctCustomers = await orderModel.aggregate([
  {
    $match: { 'items.sellerId': sellerId }
  },
  {
    $group: {
      _id: "$user"
    }
  },
  {
    $count: "customercount"
  }
])
console.log("customer count=",distinctCustomers,revenue)

let cardData={}
cardData.totalsales=revenue[0].totalsales || 0
cardData.totalorder=revenue[0].totalProductOrders || 0
cardData.pendingOrder=revenue[0].pendingorders || 0
cardData.customer=distinctCustomers[0].customercount || 0



        
        res.status(200).json({message:'got it ',cardData})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
    }
}

const salesreport=async(req,res)=>{
    const {filter}=req.params
    console.log("inside the seller report")
     const sellerId = new mongoose.Types.ObjectId(req.seller.id);
     let matchStage = [
  { $unwind: '$items' },
  { $match: { 'items.sellerId': sellerId } },
  { $unwind: '$items.products' },
  { $match: { 'items.products.status': 'delivered' } }
];

     try {
        if (filter === '6months') {
  const sixMonthsAgo = new Date();
    console.log(sixMonthsAgo)

  
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    console.log(sixMonthsAgo)

  sixMonthsAgo.setDate(1);
  console.log(sixMonthsAgo)

  matchStage.push({ $match: { createdAt: { $gte: sixMonthsAgo } } });

  const sales = await orderModel.aggregate([
    ...matchStage,
    {
      $group: {
        _id: { month: { $month: '$createdAt' } },
        totalsales: { $sum: '$items.products.price' }
      }
    },
    { $sort: { '_id.month': 1 } }
  ]);
          console.log(sales)
         return  res.status(200).json({message:'sales got it',sales})

}else if (filter === '7days') {
  const sevenDaysAgo = new Date();
  console.log("cur date=",sevenDaysAgo)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  console.log("last six=",sevenDaysAgo)

  matchStage.push({ $match: { createdAt: { $gte: sevenDaysAgo } } });

  const sales = await orderModel.aggregate([
    ...matchStage,
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        totalsales: { $sum: '$items.products.price' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  console.log(sales)
  return res.status(200).json({message:'sale report got it', sales });
}
        
     } catch (error) {
        console.log(error)
        res.status(500).json({message:'internal server error'})
        
     }
}

const topproducts=async(req,res)=>{
  const sellerId=new mongoose.Types.ObjectId(req.seller.id)
  try {
    const products=await productModel.aggregate([
      {
        $match:{'addedBY':sellerId}
      },{
        $sort:{'sold':-1}
      }
      
    ])
    res.status(200).json({message:'topt products got it',products})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

const getorder_dashboard=async(req,res)=>{
  const sellerId=new mongoose.Types.ObjectId(req.seller.id)
  try {
    const orders=await orderModel.aggregate([
      {
        $unwind:'$items'
      },{
        $match:{'items.sellerId':sellerId}
      },{
        $unwind:'$items.products'
      },{
        $lookup:{
          from:'products',
          localField:'items.products.productId',
          foreignField:'_id',
          as:'productDetails'
        }
      },{
        $unwind:'$productDetails'
      },{
        $lookup:{
          from:'users',
          localField:'user',
          foreignField:'_id',
          as:'user'
        }
      },
      {
        $unwind:'$user'
      },
      {

        $project:{
          _id:'$_id',
          // product:{$push:'$productDetails'},
          user:'$user',
          product:'$productDetails',
          sellerId:'$items.sellerId',
          status:'$items.products.status',
          quantiyt:'$items.products.quantity',
          price:'$items.products.price',
          mobile:'$mobile',
          adddress:'$address',
          createdAt:'$createdAt',
          deliveryDate:'$items.products.deliveryDate'
        }
       
      },
      {
        $sort:{createdAt:-1}
      }
      // ,{
      //   $limit:7
      // }
      
      

    ])
    console.log(orders.length)
    res.status(200).json({message:"orders got it",orders})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}
const product_status_change=async(req,res)=>{
  const {id,status}=req.params
  console.log(req.params)

  try {
    const product=await productModel.updateOne({_id:id},{
      $set:{
        status:status
      }
    })
    console.log('product status change',product)
    res.status(200).json({message:'status updated successfully'})
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'internal server error'})
  }
}

module.exports={registeration,logout,getcategory,addproduct,getproducts,getproduct_id,updateproduct,
    getprofile,updateprofile,banner,add_banner,delete_banner,update_banner,getOrders,changeorderstatus,order_detailpage,getReviews,delteReview,
    change_review_status,getcustomers,productDetailpage,getcardDetails,salesreport,topproducts,getorder_dashboard,product_status_change
}