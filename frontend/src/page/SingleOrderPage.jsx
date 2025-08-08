import React, { useEffect, useState } from 'react';
import axiosInstance from '../configure/axios';
import { useParams } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../Redux/LoadingSlic'

const SingleProductOrder = () => {
    const dispatch=useDispatch()
    const {id,productId}=useParams()
     const[order,setOrder]=useState()

    useEffect(()=>{
        getorder()

    },[id])
    const getorder=async()=>{
        try {
            dispatch(showLoading())
            const response =await axiosInstance.get(`/seller/order/${id}/${productId}`)
            console.log(response)
            setOrder(response?.data?.Order)
        } catch (error) {
            console.log(error)
        }finally{
            dispatch(hideLoading())
        }
    }
  // Sample data for an order with one product
//   const order = {
//     id: 'ORD-98765',
//     date: '2023-06-20',
//     status: 'Shipped',
//     product: {
//       name: 'Premium Wireless Earbuds',
//       price: 129.99,
//       quantity: 1,
//       color: 'Black',
//       sku: 'BUD-2023-BLK'
//     },
//     customer: {
//       name: 'Sarah Johnson',
//       email: 'sarah.j@example.com',
//       phone: '+1 (555) 987-6543'
//     },
//     delivery: {
//       address: '456 Oak Avenue, Apt 302',
//       city: 'Los Angeles',
//       state: 'CA',
//       zip: '90015',
//       country: 'United States',
//       method: 'Standard Shipping'
//     },
//     total: 142.49 // Includes tax and shipping
//   };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-sm">
      {/* Order header */}
      <div className="border-b pb-3 mb-4">
        <h1 className="text-lg font-bold">Order Details</h1>
        <p className="text-sm text-gray-500">Placed on {order?.createdAt}</p>
        {/* {/* <p className="text-sm text-gray-500">Placed on {order.date}</p> */}
        <p className="text-sm text-gray-500"><span className='font-medium'>payment Status:</span> {order?.paymentStatus}</p> 
        <div className="mt-1"><p className='flex'>
            Order status:
       
          <span className={`text-xs px-2 py-1 rounded ${
            order?.items.products.status === 'pending' ? 'bg-yellow-600 text-white':
            order?.items.products.status === 'Shipped' ? 'text-white bg-blue-800' :
           order?.items.products.status === 'delivered' ? 'bg-green-800 text-white' :
            'bg-red-500-100 text-white'
          }`}>
            { order?.items?.products.status || 'status'}  
          </span>
           </p>
        </div>
      </div>

      {/* Product section */}
      <div className="mb-5  bg-gray-50 rounded">
        <h2 className="font-bold mb-2">Product details</h2>
        <div>
            <img src={order?.product.images[0]} className='object-cover w-20 h-20' alt="" srcset="" />
        </div>
        <div className="flex ">
          <div className='space-y-2'>
            <p className="font-medium">{order?.product.name}</p>
            {/* <p className="text-sm text-gray-600">SKU: {order?.product.sku}</p> */}
            <p className="text-sm text-gray-600">Color: {order?.product.description}</p>
            <p className="text-sm text-gray-600">Qty: {order?.items.products.quantity}</p>
             <p className="text-sm text-gray-600">price: <span className='font-semibold'>{order?.items.products.price}</span></p>
          </div>
         
        </div>
      </div>

      {/* Customer info */}
      <div className="mb-5">
        <h2 className="font-medium mb-2">Customer</h2>
        <div className="text-sm">
          <p>{order?.user.username}</p>
          <p className="text-gray-600">{order?.user.email}</p>
          <p className="text-gray-600">{order?.mobile}</p>
        </div>
      </div>

      {/* Delivery info */}
      <div className="mb-5">
        <h2 className="font-medium mb-2">Delivery</h2>
        <div className="text-sm">
          <p>{order?.address}</p>
          {/* <p>{order.delivery.city}, {order.delivery.state} {order.delivery.zip}</p>
          <p>{order.delivery.country}</p> */}
          <p className="mt-2 text-gray-600">Method:</p>
        </div>
      </div>
 
      {/* Order total */}
      {/* <div className="border-t pt-3">
        <div className="flex justify-between font-medium">
          <span>Order Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
      </div> */}
    </div>
  );
};

export default SingleProductOrder;