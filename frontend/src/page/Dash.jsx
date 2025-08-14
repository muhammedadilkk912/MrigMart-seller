
  import React, { useEffect, useState } from 'react'
  import axiosInstance from '../configure/axios'
  import { FaMoneyBill, FaBoxOpen, FaUsers, FaClock } from 'react-icons/fa';
  import Chart from '../component/Chart';
  import { IoEllipsisVertical } from "react-icons/io5";
  import { useDispatch } from 'react-redux';
  import { showLoading,hideLoading } from '../Redux/LoadingSlic';


const CARD_CONFIG = {
  Sales: {
    icon: <FaMoneyBill size={24} className="text-green-600" />,
    bg: "bg-green-100"
  },
  Orders: {
    icon: <FaBoxOpen size={24} className="text-blue-600" />,
    bg: "bg-blue-100"
  },
  Customers: {
    icon: <FaUsers size={24} className="text-purple-600" />,
    bg: "bg-purple-100"
  },
  "Pending Order": {
    icon: <FaClock size={24} className="text-yellow-600" />,
    bg: "bg-yellow-100"
  }
};
  
  const Dash = () => {
    console.log('insie the Das')
  //   const stats = [
  //   { title: "Total Revenue", value: "$45,231", change: "+12%", icon: "ph ph-currency-dollar", trend: "up" },
  //   { title: "Total orders ", value: "2,345", change: "+18%", icon: "ph ph-user-plus", trend: "up" },
  //   { title: "customers", value: "124", change: "-2%", icon: "ph ph-clock", trend: "down" },
  //   { title: "pending orders", value: "3.2%", change: "+0.4%", icon: "ph ph-trend-up", trend: "up" },
   
  // ];
  const dispatch=useDispatch()
let [card, setCard] = useState([]);
const [products,setProducts]=useState([])
const [orders,setOrders]=useState([])
const [dropdown,setDropdown]=useState(null)

useEffect(() => {
  getCardDetail();
}, []);

const getCardDetail = async () => {
  try {
    dispatch(showLoading())
    const response = await axiosInstance.get('/seller/dashboard/getcardDetail');
    console.log(response);

    let data = response?.data;
    getorders()

    setCard([
      {
        title: 'Sales',
        value: data.cardData.totalsales,
      },
      {
        title: 'Orders',
        value: data.cardData.totalorder,
      },
      {
        title: 'Customers',
        value: data.cardData.customer,
      },
      {
        title: 'Pending Order',
        value: data.cardData.pendingOrder,
      },
    ]);
  } catch (error) {
    console.log(error);
  }finally{
    dispatch(hideLoading())
    topProducts()
    
  }
};

const topProducts=async()=>{
  try {
    const response=await axiosInstance.get('/seller/dashboard/topproducts')
    console.log("top products",response)
    setProducts(response?.data?.products)
  } catch (error) {
    console.log(error)
  }
}
const getorders=async()=>{
  try {
    const response=await axiosInstance.get('/seller/dashboard/getorder')
    console.log('get order',response)
     setOrders(response?.data?.orders)
  } catch (error) {
    console.log(error)
  }
}
 function getDateOnly(isoString) {
  const date = new Date(isoString);
  // console.log(date)
  return date.toISOString().split("T")[0]; // Returns "2025-07-27"
}
const changestatus=async(orderId,productId,newStatus,oldStatus)=>{
  if(oldStatus === newStatus){
    return null
  }
  let url=`/seller/changeorderstatus/${orderId}`
  url+=`?productId=${productId}&status=${newStatus}`
  try {
    const response=await axiosInstance.put(url)
    console.log(response)
    setDropdown(null)
    getorders()

  } catch (error) {
    console.log(error)
  }
}



    return (
     <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        {/* <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
          Generate Report
        </button> */}
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {card?.map((stat, index) => {  
    const config = CARD_CONFIG[stat.title] || {};
    return (
      <div 
        key={index} 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {stat.title}
            </p>
            <p className="text-2xl font-bold mt-2 dark:text-white text-gray-800">
              {stat.value}
            </p>
            {/* Optional growth indicator */}
            {stat.growth && (
              <div className={`mt-2 inline-flex items-center text-sm font-medium ${stat.growth > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.growth > 0 ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 01-1 1H9v1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h2v-1H5a1 1 0 110-2h2V8H5a1 1 0 010-2h2V5a1 1 0 112 0v1h2a1 1 0 011 1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {Math.abs(stat.growth)}%
              </div>
            )}
          </div>
          <div className={`h-12 w-12 rounded-lg ${config.bg} flex items-center justify-center text-white`}>
            {config.icon && React.cloneElement(config.icon, { className: "w-6 h-6" })}
          </div>
        </div>
      </div>
    )
  })}
</div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h1 className='font-semibold  sm:text-2xl tracking-wide'>Sales Report </h1>
          

          <Chart/>


          {/* <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h2>
            <select className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div> */}
          {/* <div className="h-80"> */}
            {/* Chart would go here */}
            {/* <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Sales chart visualization</p>
            </div> */}
          {/* </div> */}
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h2>
          <div className="space-y-4">
            {products?.map((item) => (
              <div key={item} className="flex items-end">
                <div className='flex gap-2'>
                  <div>
                    <img src={item.images[0]} alt="" srcset=""className='rounded-full w-10 h-10' />
                  </div>
                  <div className='flex flex-col'>
                    <p>{item.name}</p>
                    <p className="text-sm font-medium text-gray-400 dark:text-white">solded:{item.sold}</p>
                    
                  </div>

                </div>
          
              
              </div>
            ))}
          </div>
        </div>
         {/* Stats Grid */}
      
      </div>
      <div className='w-full flex flex-col bg-white rounded-xl shadow-sm border-gray-200'>
        <h2 className='mx-2 my-3 text-2xl font-medium'>Orders</h2>
  <div className=" dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
         <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
             product Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {

        orders.length > 0 ? orders.map((order,index)=>(

       
           <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
           
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.product.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.user.username}
            </td>
            
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order?.deliveryDate && getDateOnly(order.deliveryDate) || 'not shipped'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${order.status === 'delivered' ?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                  order.status === 'shipped'?'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                  order.status === 'pending' ? 'bg-yellow-100 text-orange-800 dark:bg-orange-900 dark:text-orage-200':
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                } `}>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {order.price}
            </td>
            <td className="px-6  relative py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              <IoEllipsisVertical
              onClick={()=>{
                dropdown === index ? setDropdown(null)
                :setDropdown(index)
              }}
               size={18}/>
              {
                dropdown===index &&(
                   <div className='absolute right-5 w-28 border z-50 rounded-md border-gray-300 bg-white'>
                <ul>
                  <li onClick={()=>changestatus(order._id,order.product._id,'shipped',order.status)} className='px-2 py-2 border-b hover:bg-gray-100 hover:font-medium border-gray-200'>Shipped</li>
                  <li onClick={()=>changestatus(order._id,order.product._id,'delivered',order.status)}  className='px-2 py-2 border-b hover:bg-gray-100 hover:font-medium border-gray-200'>Delivered</li>
                  <li onClick={()=>changestatus(order._id,order.product._id,'cancelled',order.status)}  className='px-2 py-2 border-b hover:bg-gray-100 hover:font-medium border-gray-200'>cancelled</li>
                </ul>

              </div>

                )
              }

             
            </td>
          </tr>

         )):(
         
          <tr key={1}  className=' '>
            <td colSpan="5" className=' py-10 text-center font-medium text-gray-500'>no orders found</td>
          </tr>
        )


        }
       
       
          {/* Sample rows - replace with your data */}
         
          
          
        </tbody>
      </table>
    </div>
  </div>
</div>


    </div>
    )
  }
  
  export default Dash
  

