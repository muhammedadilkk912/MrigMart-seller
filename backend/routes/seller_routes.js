const express=require('express')
const upload=require('../middleware/multer')     
const protectroute=require('../middleware/protectroute')
const {registeration,logout,getcategory,addproduct,getproducts,getproduct_id,updateproduct,getprofile,
       updateprofile,banner,add_banner,delete_banner,update_banner,getOrders,changeorderstatus,order_detailpage,getReviews,delteReview,
       change_review_status,getcustomers,productDetailpage,getcardDetails,salesreport,topproducts,getorder_dashboard,product_status_change
}=require('../controllers/sellercontroller')   

const router=express.Router()            


router.post('/registeration',protectroute,upload.single('image'),registeration)
router.post('/logout',protectroute,logout)
router.get('/getcategory',protectroute,getcategory)
router.post('/addproduct',protectroute,upload.array('images',5),addproduct)
router.get('/getproducts/:page',protectroute,getproducts)
router.get('/getproduct/:id',protectroute,getproduct_id)
router.put('/updatedproduct/:id',protectroute,upload.array('images',5),updateproduct)
router.put('/product/change_status/:id/:status',protectroute,product_status_change)
router.get('/getprofile',protectroute,getprofile)
router.put('/updateprofile',protectroute,upload.single('image'),updateprofile)
router.get('/existingbanners',protectroute,banner)
router.post('/add_banner',protectroute,add_banner)
router.delete('/delete_banner/:id',protectroute,delete_banner)
router.put('/update_banner/:id',protectroute,update_banner)
router.get('/getorders/:page',protectroute,getOrders)
router.put('/changeorderstatus/:id',protectroute,changeorderstatus)
router.get('/order/:id/:productId',protectroute,order_detailpage) 
router.get('/getreviews/:page',protectroute,getReviews)
router.delete('/deleteReview/:id',protectroute,delteReview)
router.put(`/change_review_status/:id/:status`,protectroute,change_review_status)
router.get('/getcustomers/:page',protectroute,getcustomers)
router.get('/getproduct/details/:id',protectroute,productDetailpage)


//dahboard routes
router.get('/dashboard/getcardDetail',protectroute,getcardDetails)
router.get('/dashboard/salesreport/:filter',protectroute,salesreport)
router.get('/dashboard/topproducts',protectroute,topproducts)
router.get('/dashboard/getorder',protectroute,getorder_dashboard)


module.exports=router 