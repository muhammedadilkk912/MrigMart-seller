import React, { useEffect, useState } from 'react';
import { FiSearch, FiMoreVertical, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../Redux/LoadingSlic';
import { useDebounce } from 'use-debounce';

const CustomersPage = () => {
  // Sample customer data
  const dispatch=useDispatch()
  const [page,setPage]=useState(1)
  const [totalPage,setTotalpage]=useState(null)
  const [customers, setCustomers] = useState([]);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('joined');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchDebounce]=useDebounce(searchTerm,500)

 

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'orders') {
        return sortOrder === 'asc' ? a.orders - b.orders : b.orders - a.orders;
      } else {
        return sortOrder === 'asc' 
          ? new Date(a.joined) - new Date(b.joined) 
          : new Date(b.joined) - new Date(a.joined);
      }
    });

  // Toggle sort order
  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
    useEffect(()=>{
        getcustomers()
  },[page,searchDebounce,statusFilter]) 

  const getcustomers=async()=>{
    console.log(statusFilter)
   
    let url=`/seller/getcustomers/${page}`
    if(statusFilter){
      url+=`?status=${statusFilter}` 
    }
    if(searchTerm){
      url+=`&search=${searchTerm}`
    }

    try {
        dispatch(showLoading())
        const response=await axiosInstance.get(url)
        console.log(response)
        setCustomers(response?.data?.customers)
        setTotalpage(response?.data?.totalpage)
    } catch (err) {
        console.log(err)
    }finally{
      dispatch(hideLoading())
    }

  }



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortBy === 'name' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('orders')}
                >
                  <div className="flex items-center">
                    Orders
                    {sortBy === 'orders' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('joined')}
                >
                  <div className="flex items-center">
                    Joined
                    {sortBy === 'joined' && (
                      <span className="ml-1">
                        {sortOrder === 'Active' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length > 0 ? (
                customers.map((customer,index) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          {
                            !customer ?.log ?(
                              <div>
                                <img src="/user.png" alt="" className='w-8 h-8 rounded-full object-cover' srcset="" />
                              </div>
                            ):(
                                    <FiUser className="text-blue-600" />
                            )
                          }
                          {/* */}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          {/* <div className="text-sm text-gray-500">ID: {customer._id}</div> */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <FiMail className="mr-2 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <FiPhone className="mr-2 text-gray-400" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalOrders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(customer.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'Active' ? 'bg-green-100 dark:bg-green-100 text-green-800' :
                         customer?.status === 'Inactive'? 'bg-gray-500 text-gray-50 ' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <FiMoreVertical />
                        </button>
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg hidden group-hover:block z-10 border border-gray-200">
                          <button className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <FiEdit2 className="mr-2" /> Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(customer.id)}
                            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiTrash2 className="mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No customers found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>  
        {
          totalPage && totalPage !==1 && (
            <div className="flex justify-center sm:justify-end my-2 mx-2">
  <div className="flex items-center gap-2  px-3 py-2 rounded-md ">
    <button
      type="button"
      className={`px-3 py-1 border rounded-md ${
        page === 1
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-gray-600 hover:bg-gray-100'
      }`}
       onClick={() => setPage(page - 1)}
       disabled={page === 1}
    >
      Back
    </button>

    <div className="px-4 py-1 border text-blue-700 rounded-md border-blue-400 text-sm font-medium">
      {page}
    </div>

    <button
      type="button"
      className={`px-3 py-1 border rounded-md ${
        page === totalPage
          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
          : 'border-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setPage(page + 1)}
      disabled={page === totalPage}
    >
      Next
    </button>
  </div>
</div>

          )
        }
         
      </div>
    </div>
  );
};

export default CustomersPage;