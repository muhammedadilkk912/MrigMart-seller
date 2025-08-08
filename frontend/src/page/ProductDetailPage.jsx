import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  FiChevronLeft, 
  FiPackage, 
  FiDollarSign, 
  FiInfo, 
  FiBox, 
  FiTag, 
  FiLayers,
  FiEdit2,
  FiTrendingUp,
  FiShoppingBag
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { hideLoading, showLoading } from '../Redux/LoadingSlic';
import { Badge, Chip, Divider } from '@mui/material';

const SellerProductDetailPage = () => {
  const { id } = useParams();   
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    getProduct();
  }, [id]);

  const getProduct = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get(`/seller/getproduct/details/${id}`);
      console.log(response)
      setProduct(response?.data?.product);
      setSelectedImage(response?.data?.product?.product?.images[0]|| '');
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };
  console.log("product=",product)

  if (!product) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FiChevronLeft className="mr-1" size={20} />
          <span className="font-medium">Back to Products</span>
        </button>
        
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiEdit2 className="mr-2" size={16} />
            Edit Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <img 
              src={selectedImage} 
              alt={product?.product.name} 
              className="w-full h-80 object-cover p-2"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Product+Image';
              }}
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-3">
            {product?.product?.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === image 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=Thumbnail';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          {/* Title and Status */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.product?.name}</h1>
            <div className="flex items-center space-x-3">
              <Badge 
                color={product?.product?.status === 'Active' ? 'success' : 'error'} 
                variant="dot" 
                overlap="circular"
              >
                <Chip 
                  label={product?.product?.status} 
                  size="small"
                  color={product.status === 'Active' ? 'success' : 'default'}
                  className="text-xs"
                />
              </Badge>
              {/* <span className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</span> */}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-xs">
              <div className="flex items-center text-blue-600 mb-1">
                <FiDollarSign className="mr-2" />
                <span className="font-medium">Selling Price</span>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">${product?.product?.discountprice}</span>
                {product.discount > 0 && (
                  <span className="ml-2 line-through text-gray-400">${product?.product?.price}</span>
                )}
              </div>
              {product?.product?.discount > 0 && (
                <div className="mt-1">
                  <Chip 
                    label={`${product?.product?.discount}% OFF`} 
                    size="small" 
                    color="success"
                    variant="outlined"
                  />
                </div>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-green-100 shadow-xs">
              <div className="flex items-center text-green-600 mb-1">
                <FiTrendingUp className="mr-2" />
                <span className="font-medium">sales</span>
              </div>
              <div className="text-2xl font-bold">
                {/* {product?.product?.price > 0 
                  ? `${Math.round(((product?.product?.discountprice - product.cost) / product.discountprice) * 100)}%` 
                  : 'N/A'} */}
                  ₹{product?.totalSales}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                
                {/* ${(product.totalSales ).toFixed(2)}   profit per unit */}
              </div>
            </div>
          </div>

          {/* Inventory Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
              <div className="flex items-center text-purple-600 mb-1">
                <FiPackage className="mr-2" />
                <span className="font-medium">Stock</span>
              </div>
              <div className="text-2xl font-bold">{product.product?.stock}</div>
              <div className="text-xs text-gray-500">units available</div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-xs">
              <div className="flex items-center text-orange-600 mb-1">
                <FiShoppingBag className="mr-2" />
                <span className="font-medium">Sold</span>
              </div>
              <div className="text-2xl font-bold">{product?.sold || 0}</div>
              <div className="text-xs text-gray-500">units sold</div>
            </div>
          </div>

          {/* Divider */}
          <Divider className="my-2" />

          {/* Product Specifications */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Specifications</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-gray-500 font-medium">Category</p>
                    <p>{product?.category || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 font-medium">discount</p>
                    <p>{product?.product?.discount+' % '|| 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 font-medium">price</p>
                    <p>{product?.product?.price || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-500 font-medium">Dimensions</p>
                    <p>{product?.product?.status || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{product?.product?.description}</p>
            </div>

            {product.core_details && Object.keys(product.core_details).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">specific Details</h3>
                <div className="bg-white border border-gray-100 rounded-lg divide-y divide-gray-100">
                  {Object.entries(product.core_details).map(([key, value], index) => (
                    <div key={index} className="px-4 py-3 flex justify-between">
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-gray-800 text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProductDetailPage;