import React, { useState } from 'react';
import { Search, ChevronDown, Calendar, Filter, Download } from 'lucide-react';
import { useEffect } from 'react';
import axiosInstance from '../configure/axios'
import { useDebounce } from 'use-debounce';
import {useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../Redux/LoadingSlic'
import { FaRegEye } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';



const Order = () => {
const dispatch=useDispatch()
  const navigate=useNavigate()
 const [orders,setOrders]=useState([])
  const [page,setPage]=useState(1)
  const [totalpage,setTotalpage]=useState()
  console.log("totalpage=",totalpage)
  const [dropdown,setDropdown]=useState(null)


  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all-time',
    // payment: 'all'
  });
    const [searchDebounce] = useDebounce(filters.search, 1000);


  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'shipped' },
    { value: 'delivered', label: 'delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all-time', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    // { value: 'custom', label: 'Custom Range' }
  ];

  const paymentOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'cash', label: 'Cash on Delivery' }
  ];

  useEffect(()=>{
    getorders()
  },[filters.status,filters.dateRange,searchDebounce])
  const getorders=async(req,res)=>{
    let params=[]

    if(filters.status)
    params.push(`status=${filters.status}`)
   
    if(filters.dateRange){
      params.push(`filterdate=${filters.dateRange}`)
    }
    if(filters.search){
      params.push(`search=${filters.search}`)
    }
     let url=`/seller/getorders/${page}`
   if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
   
    try {
      dispatch(showLoading())   
      const response=await axiosInstance.get(url)
      console.log("response in order",response)
      setOrders(response?.data?.orders)
      setTotalpage(response?.data?.totalPage)
   console.log()
    } catch (error) {
      console.log(error)
    }finally{
      dispatch(hideLoading())
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
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

useEffect(() => {
  // Function to handle clicks anywhere in the document
  const handleClickOutside = () => {
    setDropdown(null);
  };

  // Attach event listener
  document.addEventListener("click", handleClickOutside);

  // Cleanup when component unmounts
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);     

// console.log(orders)

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Order Management</h1>
          {/* <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              <Download size={16} />
              Export
            </button>
          </div> */}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              name="status"
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              value={filters.status}
              onChange={handleFilterChange}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              name="dateRange"
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              value={filters.dateRange}
              onChange={handleFilterChange}
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Payment Filter */}
          {/* <div className="relative">
            <select
              name="payment"
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
              value={filters.payment}
              onChange={handleFilterChange}
            >
              {paymentOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div> */}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">delivery date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order,index) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{index+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order?.user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order?.items.product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order?.deliveryDate&&getDateOnly(order?.deliveryDate) || 'not shipped'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.items.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.items.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pending' ? 'bg-red-100 text-red-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.items.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.items.price}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <div className="relative inline-block">
    <button
      onClick={() => navigate(`/seller/orders/${order._id}/${order?.items.product._id}`)}
      className="text-blue-600 hover:text-blue-900 mr-3"
    >
      <FaRegEye size={18} />
    </button>

    <button
      onClick={(e) =>{
          e.stopPropagation();
        setDropdown(dropdown === index ? null : index)}
      }
      className="text-gray-600 rounded hover:bg-gray-100"
    >
      <IoEllipsisVertical size={18} />
    </button>

    {dropdown === index && (
      <div className={`absolute right-0 ${index>= orders.length-2? 'bottom-5':'' }  mt-1 w-32 z-50 shadow-lg py-1 rounded-md  bg-white border border-gray-300`}>
        <button 
        onClick={()=>changestatus(order._id,order?.items?.product?._id,'shipped',order.items.status)}
        className="block px-2  border-b-gray-50 hover:bg-gray-100 w-full py-1 text-left">
          Shipped
        </button>
        <button 
        onClick={()=>changestatus(order._id,order?.items?.product?._id,'delivered',order.items.status)}
        className="block px-2 border-b-gray-50 hover:bg-gray-100 w-full py-1 text-left">
          Delivered
        </button>
        <button 
        onClick={()=>changestatus(order._id,order?.items?.product?._id,'cancelled',order.items.status)}
        className="block px-2 hover:bg-gray-100 w-full py-1 text-left">
          Cancelled
        </button>
      </div>
    )}
  </div>
</td>

                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end">
          {/* <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">24</span> results
          </div> */}
          <div className="flex gap-1">
            {
             !totalpage || (totalpage > 1   )&&(
                <>
                 <button
            disabled={page === 1}
            onClick={()=>setPage(page-1)}
             className={`px-3 py-1 border rounded-md text-sm bg-white ${page===1?'cursor-not-allowed bg-gray-400':'border-gray-300'}  text-gray-700 hover:bg-gray-50`}>
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md text-sm bg-blue-50 border-blue-500 text-blue-600">
              1
            </button>
            {/* <button className="px-3 py-1 border rounded-md text-sm bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              2
            </button> */}
            <button 
            disabled={page===totalpage}
            onClick={()=>setPage(page-1)}
            className={`px-3 py-1 border rounded-md text-sm bg-white ${page===totalpage ? 'cursor-not-allowed bg-gray-400':'border-gray-300'}  text-gray-700 hover:bg-gray-50`}>
              Next
            </button>
            </>

              )
            }

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
