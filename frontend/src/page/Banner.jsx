import { useState, useEffect, useRef } from 'react';
import axiosInstance from '../configure/axios';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../Redux/LoadingSlic';
import Cropper from 'react-easy-crop';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';

const Banner = () => {
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    image: null,
    link: '',
    isActive: true,
  });
  const [edit, setEdit] = useState(null);
  const [image, setImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // console.log()

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get('/seller/existingbanners');
      setBanners(response.data.banners || []);
      setProducts(response.data.products || []);
    } catch (err) {
      toast.error('Failed to fetch banners');
    } finally {
      dispatch(hideLoading());
    }
  };

    const handleFileChange = (e) => {
      console.log("inside the filte changes",e.target.files)
      let size=2*1024*1024 //2mb
      if(e.target.files[0].size >size){
        console.log("inside the ")
        toast.warning('file size should be less than 2mb')
        return null
      }else{
        console.log("else part")
      }
      let typeFormat=['image/png','image/jpeg','image/jpg']
      if(!typeFormat.includes(e.target.files[0].type)){
        toast.warning('file format should be png or jpg')
        return null
      }
      
      
     
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImage(reader.result));
      
      setShowCropModal(true)
      reader.readAsDataURL(e.target.files[0]);
    }

  };
   const onCropComplete=(croppedArea,croppedAreaPixels)=>{
  setCroppedAreaPixels(croppedAreaPixels)
 }
 const applyCrop = async () => {
  console.log("inside the cropped image");

  if (!image || !croppedAreaPixels) return;

  const croppedImg = await getCroppedImg(image, croppedAreaPixels);
  console.log(croppedImg);

  setNewBanner((prev) => ({
    ...prev,
    image: croppedImg,
  }));

  setShowCropModal(false);
};

 console.log("new banner=",newBanner)
    // Utility function to crop the image
  const getCroppedImg = (imageSrc, crop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );

        resolve(canvas.toDataURL("image/png")); // Return cropped image as a Data URL
      };

      image.onerror = (error) => reject(error);
    });
  };




const handleSubmit=async(e)=>{
 e.preventDefault()
 if(newBanner.image==''){
  toast.error('image is required')
  return null
 }
 try {
  dispatch(showLoading())           
  // const formData=new FormData
  // // formData.append('image',JSON.stringify(newBanner.image))
  // // formData.append('link',JSON.stringify(newBanner.link))
  // formData.append('image',newBanner.image)
  //  formData.append('link',newBanner.link)
  // formData.append('isActive',JSON.stringify(newBanner.isActive))
  // const response =await axiosInstance.post('/seller/add_banner',formData,{
  //        headers:{'Content-Type':'multipart/form-data'}
  //     })
  const response=await axiosInstance.post('/seller/add_banner',newBanner)
  console.log(response)
  toast.success(response?.data?.message)
  setShowForm(false)
  setNewBanner({})
  fetchBanners()
 } catch (error) {
  console.log(error)
 }finally{
  dispatch(hideLoading())
 }
 console.log("new banner=",newBanner)
}

 

  const handleDelete = async (id) => {
    console.log("delete id=",id)
    // if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      dispatch(showLoading());
     const response=await axiosInstance.delete(`/seller/delete_banner/${id}`)
     toast.success(response?.data?.message)
     fetchBanners()
    } catch (err) {
      console.log(err)
    } finally {
      dispatch(hideLoading());
    }
  };
  const editval=()=>{
    console.log(Object.keys(newBanner))
    const c=Object.keys(newBanner).some((val)=>{
      console.log(newBanner[val],"=",edit[val])
      
      
      // console.log("check=",newBanner[val])
     return edit[val]!== newBanner[val]
    }
    )
    return c
  }

  const handleEdit=(val)=>{
    console.log(val)
    setNewBanner({image:val.image,isActive:val.isActive,link:val.link})
    setEdit(val)
    console.log(newBanner)
    setShowForm(true)
    
  }

  const handleEditSubmit=async(e)=>{
   
    e.preventDefault()
    console.log("nnn=",newBanner)
    if(!newBanner.image){
      toast.warning('no changes are made')
      return null
    }
    let validation=editval()
    if(validation){
      let obj={}
      if(edit.image!==newBanner.image){
        obj.image=newBanner.image

      }
      if(edit.isActive!== newBanner.isActive){
        obj.isActive=newBanner.isActive
      }
      if(edit.link !== newBanner.link){
        obj.link=newBanner.link
      }
      console.log("obj=",obj)
      
      try {
        dispatch(showLoading())      
        const response=await axiosInstance.put(`/seller/update_banner/${edit._id}`,obj)
        console.log(response)
        toast.success(response?.data?.message)
        setShowForm(false)
        setNewBanner({})
        fetchBanners()
        
      } catch (error) {
        console.log("error in edit banner=",error)
      }finally{
        dispatch(hideLoading())
      }
    }
    console.log("val change",editval())
  }
//  console.log("edit data=",edit)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your store banners and promotions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showForm ? (
            <>
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <FiPlus className="mr-2 h-4 w-4" />
              Add Banner
            </>
          )}
        </button>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Crop Image</h3>
              <button
                onClick={() => {
                  setShowCropModal(false);
                  setNewBanner(prev => ({ ...prev, image: null }));
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setImage(null)
                  setShowCropModal(false);
                  setNewBanner(prev => ({ ...prev, image: null }));
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Form */}
      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {edit ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          
          <form onSubmit={edit ? handleEditSubmit : handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image *
              </label>
              
              {newBanner.image ? (
                <div className="relative group">
                  <img
                    src={newBanner.image}
                    alt="Banner preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setNewBanner(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiTrash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ) : (
               <label className="mt-1 flex h-48 sm:mx-10 items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">
  <div className="space-y-1 text-center">
    <div className="flex text-sm text-gray-600 justify-center">
      <span className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
        Upload an image
      </span>
    </div>
    <p className="text-xs text-gray-500">
      PNG, JPG up to 2MB
    </p>
  </div>

  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="sr-only"
  />
</label>

              )}
            </div>

            {/* Product Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Link to Product
              </label>
              <select
                id="link"
                name="link"
                value={newBanner.link}
                onChange={handleFileChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">{products.length > 0 ? "Select a product" : "No products available"}</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={newBanner.isActive}
                onChange={handleFileChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {setShowForm(false)
                  setNewBanner(prev =>({...prev,image:null}))
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newBanner.image}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  newBanner.image ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-400 cursor-not-allowed'
                }`}
              >
                {edit ? 'Update Banner' : 'Add Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners Grid */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Banners</h2>
        
        {banners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => {
              const statusColors = {
                Active: 'bg-green-100 text-green-800',
                Pending: 'bg-yellow-100 text-yellow-800',
                Inactive: 'bg-gray-100 text-gray-800'
              };

              return (
                <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                  <div className="relative">
                    <img
                      src={banner.image}
                      alt="Banner"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                        title="Edit"
                      >
                        <FiEdit2 className="h-4 w-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[banner.status] || 'bg-gray-100 text-gray-800'}`}>
                        {banner.status}
                      </span>
                      
                      {banner.link && (
                        <span className="text-xs text-gray-500 truncate">
                          Linked to: {products.find(p => p._id === banner.link)?.name || 'Product'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new banner.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                New Banner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;