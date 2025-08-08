import {  useState } from 'react';
import { toast } from 'react-toastify';
import { showLoading,hideLoading } from '../Redux/LoadingSlic';
import Spinner from '../component/Spinner';

import axiosInstance from '../configure/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';

const BusinessReg = () => {
  const loading=useSelector((state)=>state.loading.isLoading)
  const dispatch=useDispatch
  const navigate=useNavigate()
  const [data, setData] = useState({
    businessName: '',
    businessType: '',
    mobile:'',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      country: '',
      pin:''
    },
    banking: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      ifscCode: ''
    }
  });
  const [logo,setLogo]=useState() 
  const [preview,setPreview]=useState()
  const [errors,setErrors]=useState({})
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name,value)   
    // console.log(name.split('.'))
    if(name.includes('.')){
        const [parent ,child]=name.split('.')  
        console.log('parent=',parent,"and child",child)
        setData((prev)=>({
            ...prev,
            [parent]:{
                ...prev[parent],
                [child]:value
            }
        }))

    }else{
       setData((prev)=>({
        ...prev,
        [name]:value
       }))
    }
    
   
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log(file)  
    let maxsize=3*1024*1024
    console.log(maxsize)
    const imagetype=['image/jpg','image/png','image/jpeg']
    console.log("inside the emage type=",imagetype.includes(file.type));
    
    if(!imagetype.includes(file?.type)){
        toast.warning('this type file not accept')
        return null


    }
    if(file.size>maxsize){
        toast.warning('maximum upload size is 3mb')
        return null
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
       
        setPreview(reader.result)
        setLogo(file)
      };
      reader.readAsDataURL(file);
    }
  };
  
  const scrollAndFocus = (id) => {
  const el = document.getElementById(id);
  console.log("el=",el)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus();
  }
};

  
 

  const validation=()=>{
    setErrors({})
    console.log('errors=',errors)
    if(!data.businessName.trim()){
     
      toast.error("business name is required")
      setErrors({businessName:true})
     scrollAndFocus('businessName')
      return false
      
    }
    if(!data.businessType){
      toast.error('business type is required')
      setErrors({businessType:true})
           scrollAndFocus('businessType')

      return false
    } 
    const mobileRegex = /^[6-9]\d{9}$/;
    if(!data.mobile.trim()){
      toast.error(' mobile number is required')
      setErrors({mobile:true})   
           scrollAndFocus('mobile')
           

      return false
    }else if(isNaN(data.mobile)){
       toast.error(' mobile number must be number')
      setErrors({mobile:true})
           scrollAndFocus('mobile')
           return false
    }else if(!mobileRegex.test(data?.mobile)){
        toast.error(' invalid mobile format')
      setErrors({mobile:true})
           scrollAndFocus('mobile')
           return false
    }
     if(!data.address.street.trim()){
       toast.error('street  is required')
      setErrors({street:true})
      scrollAndFocus('street')

      return false
     } 
     if(!data.address.city.trim()){
       toast.error('city  is required')
      setErrors({city:true})
      scrollAndFocus('city')

      return false
     }
     if(!data.address.district.trim()){
       toast.error('district is required')
      setErrors({district:true})
      scrollAndFocus('district')

      return false
     }
     if(!data.address.state.trim()){
       toast.error('state is required')
      setErrors({state:true})
      scrollAndFocus('state')

      return false
     }
     if(!data.address.country.trim()){
       toast.error('country is required')
      setErrors({country:true})
      scrollAndFocus('country')

      return false
     }
     
     if(!data.address.pin.trim()){
       toast.error('country is required')
      setErrors({pin:true})
      scrollAndFocus('pin')

      return false
     }
     if(!data.banking.accountName.trim()){
       toast.error('account name is required')
      setErrors({accountName:true})
      scrollAndFocus('accountName')

      return false
     }
     if(!data.banking.accountNumber.trim()){
       toast.error('account number is required')
      setErrors({accountNumber:true})
      scrollAndFocus('accountNumber')

      return false
     }
     if(!data.banking.bankName.trim()){
       toast.error('bank name is required')
      setErrors({bankName:true})
      scrollAndFocus('bankName')

      return false
     }
     if(!data.banking.ifscCode.trim()){
       toast.error('ifsc code is required')
      setErrors({ifscCode:true})
      scrollAndFocus('ifscCode')

      return false
     }
     return true
     
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const validate=validation()
    
  console.log("errors=",errors)
  console.log('Submitted business details:', data);
  console.log('logo=',validate)
  if(validate){
    const formdata=new FormData
    formdata.append('data',JSON.stringify(data))
    if(logo){
      formdata.append('image',logo)
    }
    try {
      const response=await axiosInstance.post('/seller/registeration',formdata,{
         headers:{'Content-Type':'multipart/form-data'}
      })
      console.log("response=",response);
      toast.success(response?.data?.message)
      navigate(-1)
    } catch (error) {
      console.log("eroor in registeration=",error)
      toast.error(error?.response?.data?.message)
      
    }
  } 
  
    
    
    // Here you would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {
        loading?(
          <Spinner/>
        ):(
            <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Business Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Business Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Business Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                   
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={data.businessName}
                    onChange={handleChange}
                   
                    className={`mt-1 block w-full  rounded-md shadow-sm py-2 px-3 ${errors?.businessName?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                 
                    id="businessType"
                    name="businessType"
                    value={data.businessType}
                    onChange={handleChange}
                   
                    className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 ${errors.businessType&&'border-2 border-red-500 focus:border-red-500 focus:ring-red-500'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select business type</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Nonprofit">Nonprofit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2'>
              

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Logo</label>
                <div className="mt-1 flex items-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Business logo preview"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No logo</span>
                    </div>
                  )}
                  <label
                    htmlFor="logo"
                    className={`ml-4 cursor-pointer  bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    <span>Upload Logo</span>
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
              <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                    Mobile number <span className="text-red-500">*</span>
                  </label>
                  <input
                   
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={data.mobile}
                    onChange={handleChange}
                   
                    className={`mt-1 block w-full  rounded-md shadow-sm py-2 px-3 ${errors?.mobile?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
              
              </div>
            </div>
            
            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Business Address</h3>
              
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  value={data.address.street}
                  onChange={handleChange}
                  
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.street&&'border-2 border-red-500 focus:border-red-500 focus:ring-red-500'} `}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    value={data.address.city}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm  ${errors.city?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'} `}
                  />
                </div>
                
                <div>
                  <label htmlFor="address.district" className="block text-sm font-medium text-gray-700">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="address.district"
                    value={data.address.district}
                    onChange={handleChange}
                    className={`mt-1 block w-full  ${errors.district?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                
                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                    State/Province <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="address.state"
                    value={data.address.state}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  ${errors.state?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

              
              
              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                 <input
                    type="text"
                    id='country'
                    
                    name="address.country"
                    value={data.address.country}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  ${errors.country?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                
              </div>
              <div>
                <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                  pin <span className="text-red-500">*</span>
                </label>
                 <input
                    type="text"
                    id='pin'
                    
                    name="address.pin"
                    value={data.address.pin}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  ${errors.pin?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                
              </div>
              </div>
            </div>
            
            {/* Banking Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Banking Details</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="banking.accountName" className="block text-sm font-medium text-gray-700">
                    Account Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="accountName"
                    name="banking.accountName"
                    value={data.banking.accountName}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  ${errors.accountName?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                
                <div>
                  <label htmlFor="banking.accountNumber" className="block text-sm font-medium text-gray-700">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="banking.accountNumber"
                    value={data.banking.accountNumber}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  ${errors.accountNumber?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="banking.bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="banking.bankName"
                    value={data.banking.bankName}
                    onChange={handleChange}
                    
                    className={`mt-1 block w-full  ${errors.bankName?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
                
                <div>
                  <label htmlFor="banking.branch" className="block text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <input
                    type="text"
                    id="branch"
                    name="banking.branch"
                    value={data.banking.branch}
                    onChange={handleChange}
                    className={`mt-1 block w-full  ${errors.branch?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="banking.ifscCode" className="block text-sm font-medium text-gray-700">
                  IFSC/SWIFT Code
                </label>
                <input
                  type="text"
                  id="ifscCode"
                  name="banking.ifscCode"
                  value={data.banking.ifscCode}
                  onChange={handleChange}
                  className={`mt-1 block w-full ${errors.ifscCode?'border-2 border-red-500 focus:border-red-500 focus:ring-red-500':'border border-gray-300'}  rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Business Details
              </button>
            </div>
          </form>
        </div>
      </div>
        )
      }

          
      
    </div>
  );
};

export default BusinessReg;