import React, { useEffect, useState } from 'react';
import { FiMoreVertical, FiTrash2, FiStar, FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';
import axiosInstance from '../configure/axios';
import {useDispatch} from 'react-redux'
import {showLoading,hideLoading} from '../Redux/LoadingSlic'
import {toast} from 'react-hot-toast';

const ReviewListingPage = () => {
    const dispatch=useDispatch()
  // Sample review data


  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [toatalpage,setTotalpage]=useState(null)
  const reviewsPerPage = 10;

  // Handle delete review
  const handleDelete = async(id) => {
    try {
        dispatch(showLoading())
        const response=await axiosInstance.delete(`/seller/deleteReview/${id}`)
        console.log(response)
        
        toast.success('deleted successfully')
    } catch (error) {
        console.log(error)
    }finally{
        dispatch(hideLoading())
    }
    
  };
   useEffect(()=>{
    getreviews()
  },[ratingFilter,statusFilter])
  const getreviews=async()=>{
     let url=`/seller/getreviews/${currentPage}`
     let params=[]
     if(ratingFilter){
        params.push(`rating=${ratingFilter}`)
     }
     if(statusFilter){
         params.push(`status=${statusFilter}`)
     }
     if(params.length > 0){
        url += `?${params.join("&")}`;
     }
    try {
       dispatch(showLoading())
        const response=await axiosInstance.get(url)
        console.log(response)
         setReviews(response?.data?.reviews)
          setTotalpage(response?.data?.toatalpage)
    } catch (error) {
        console.log(error)

    }finally{
        dispatch(hideLoading())
    }
  }
  function getDateOnly(isoString) {
  const date = new Date(isoString);
  // console.log(date)
  return date.toISOString().split("T")[0]; // Returns "2025-07-27"
}

  // Handle toggle visibility
  const toggleVisibility =async (id,status) => {
    console.log(id,status)
    let newStatus=status ==='visible'?'hidden':'visible'
   
   try {
    // if()
    dispatch(showLoading())
    const response=await axiosInstance.put(`/seller/change_review_status/${id}/${newStatus}`)
    toast.success(response?.data?.message)
    getreviews()
    console.log(response)
   } catch (error) {
    console.log(error)
    
   }finally{
    dispatch(hideLoading())
   }
  };

  // Filter reviews
//   const filteredReviews = reviews.filter(review => {
//     const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
//     const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
//     return matchesRating && matchesStatus;
//   });

  // Pagination logic
//   const indexOfLastReview = currentPage * reviewsPerPage;
//   const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
// //   const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
//   const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

//  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Customer Reviews</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="flex items-center">
            {/* <FiFilter className="mr-2 text-gray-500" /> */}
            <select 
              value={ratingFilter}
              onChange={(e) => {
                setRatingFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="visible">visible</option>
            <option value="hidden">hidden</option>
          </select>
        </div>
      </div>

      {/* Reviews list */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        {reviews.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <li key={review._id} className={`p-4 ${review?.visible ? '' : 'bg-gray-50 opacity-75'}`}>
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{review?.product?.name}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i}
                          className={`w-4 h-4 ${i < review?.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{review?.rating}.0</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      review?.status === 'visible' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review?.status}
                    </span>
                    <div className="relative group">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <FiMoreVertical className='text-gray-600' size={18}/>
                      </button>
                      <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg hidden group-hover:block z-10 border border-gray-200">
                        <button 
                          onClick={() => toggleVisibility(review._id,review.status)}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {review.status === 'visible' ? (
                            <>
                              <FiEyeOff className="mr-2" /> Hidden
                            </>
                          ) : (
                            <>
                              <FiEye className="mr-2" /> visible
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => handleDelete(review._id)}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 className="mr-2" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className={`mt-2  'text-gray-600' : 'text-gray-400'}`}>
                  {review?.comment}
                </p>
                
                <div className="mt-3 flex justify-between text-sm text-gray-500">
                  <span>By {review?.user.username}</span>
                  <span>{getDateOnly(review?.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No reviews match your filters
          </div>
        )}
      </div>

      {/* Pagination */}
      {/* {filteredReviews.length > reviewsPerPage && ( */}
      {
       toatalpage && toatalpage !== 1 &&(
           <div className="flex justify-center sm:justify-end mt-4">
  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm border border-gray-200">
    <button
      type="button"
      className={`px-3 py-1 border rounded-md ${
        currentPage === 1
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}
    >
      Back
    </button>

    <div className="px-4 py-1 border rounded-md border-gray-400 text-sm font-medium">
      {currentPage}
    </div>

    <button
      type="button"
      className={`px-3 py-1 border rounded-md ${
        currentPage === toatalpage
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setCurrentPage(currentPage + 1)}
      disabled={currentPage === toatalpage}
    >
      Next
    </button>
  </div>
</div>

        )
      }
       

       {/* )}  */}
    </div>
  );
};

export default ReviewListingPage;              