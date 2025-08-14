import React, { useEffect, useState } from "react";
import axiosInstance from "../configure/axios";
import { FaCamera, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from "../Redux/LoadingSlic";
import { setLogo } from "../Redux/authSlic";

const SimpleBusinessProfile = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("business");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [businessLogo,setBusinessLogo]=useState()
  // const [logo, setLogo] = useState();
  const [preview, setPreview] = useState();

  // State for profile data
  const [profile, setProfile] = useState({
    businessName: "",
    businessType: "",
    phone: "",
    email: "",
    status: "",
  });

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    district: "",
    country: "",
    pin: "",
  });

  const [bank, setBank] = useState({
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branch: ''
  });

  useEffect(() => {
    getprofile();
  }, []);

  const getprofile = async () => {
    try {
      dispatch(showLoading());
      const response = await axiosInstance.get("/seller/getprofile");
      const data = response?.data.profile;
      console.log(data)
      
      setProfile({
        businessName: data.businessName,
        businessType: data.businessType,
        status: data.status,
        email: data.email,
        phone: data.phone
      });

      setAddress({
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        district: data.address.district,
        country: data.address.country,
        pin: data.address.pin,
      });

      setBank({
        accountHolderName: data.bankDetails.accountHolderName,
        accountNumber: data.bankDetails.accountNumber,
        bankName: data.bankDetails.bankName,
        ifscCode: data.bankDetails.ifscCode,
        branch: data.bankDetails.branch
      });
      

      setBusinessLogo(data?.logo);
      setPreview(data?.logo);
      setEditData(data);
      dispatch(setLogo(data?.logo));
    } catch (error) {
      console.log("Error in get profile:", error);
    } finally {
      dispatch(hideLoading());
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
          console.log("file=",file)
          setBusinessLogo(file)
          
        };
        reader.readAsDataURL(file);
      }
    };
    const bus_validation=()=>{
        if(!profile.businessName.trim()){
            toast.error("busnessname is required")
            return false
        }
        if(!profile.businessType.trim()){
            toast.error("business type is required")
            return false
        }
        if(!profile.email.trim()){
            toast.error("business type is required")
            return false
        }        if(!profile.phone.trim()){
            toast.error('mobile number is required')
            return false
        }      
        const mobileRegex = /^[6-9]\d{9}$/;
        if(!mobileRegex.test(profile.phone)){
            toast.error('wrong phone number format')
            return false
        }

        return true
    }
    const addressval=()=>{
      let valid=false
      if(!address.street.trim()){
        toast.error('street is required')
        return valid=false
      }
      if(!address.city.trim()){
        toast.error('city is required')
        return valid=false
      }
        if(!address.district.trim()){
        toast.error('district is required')
        return valid=false
      }
        if(!address.state.trim()){
        toast.error('state is required')
        return valid=false
      }
        if(!address.country.trim()){
        toast.error('country is required')
        return valid=false
      }
        if(!address.pin.trim()){
        toast.error('pin is required')
        return valid=false
      }
      return valid=true
    }
  const   bankval=()=>{
    if (!bank.bankName.trim()){
      toast.error('bank name is required')
      return false
    }
    if (!bank.branch.trim()){
      toast.error('bank brach name is required')
      return false
    }
    if (!bank.accountHolderName.trim()){
      toast.error('account holder name is required')
      return false
    }
    if (!bank.accountNumber.trim()){
      toast.error('account number is required')
      return false
    }
    if (!bank.ifscCode.trim()){
      toast.error('IFSC code is required')
      return false
    }
    return true
    
  }
  const checkChanges = (currentObj, originalObj) => {
  return Object.keys(currentObj).some(key => {
    return currentObj[key] !== originalObj[key];
  });
};

    const handleSubmit=async()=>{
        const formData=new FormData
        if(activeTab==='business'){
          console.log('inside the business validation',checkChanges(profile,editData))
         let change= checkChanges(profile,editData)
         let imageCheck=editData.logo !== businessLogo?false:true
         console.log("image imageCheck=",imageCheck)
        //  console.log(logo,"=",editData.logo)   
        //  console.log("imageCheck=",imageCheck)
         if(!change&&imageCheck ){
             toast.warning("no changes are happen")
             return null
          }
         if(!imageCheck){
          console.log("changedimage")
           formData.append('image',businessLogo)
         }
         

          console.log("change=",change)
          console.log(change,"+++",imageCheck)
          console.log(bus_validation())
         
          if(change && bus_validation()){    
            formData.append('profile',JSON.stringify(profile))
          }

          // return null
          // console.log(bus_validation())
          // return null
          console.log(businessLogo)
          console.log(editData.logo)
          
          
           }else if(activeTab==='address'){
            console.log('inside addes')
              let change= checkChanges(address,editData.address)
              console.log(change);
              
          if(!change){
             toast.warning("no changes are happen")
             return null
          }
          // console.log()
          let check=addressval()
          console.log(addressval());
          
          if(addressval()){  
            formData.append('address',JSON.stringify(address) )

          }
            


           }else{
            let change= checkChanges(bank,editData.bankDetails)
            console.log(change)
          if(!change){
             toast.warning("no changes are happen")
             return null
          }   
          if(bankval())
           formData.append('bank',JSON.stringify(bank) )

           }
           try {
            dispatch(showLoading())
            const response=await axiosInstance.put('/seller/updateprofile',formData,{
         headers:{'Content-Type':'multipart/form-data'}
      })
      console.log(response)
      toast.success(response?.data?.message)
      setIsEditing(false)
      getprofile()
           } catch (error) {
            console.log('error in update profile',error)
            toast.error(error?.response?.data?.message)
           }finally{
            dispatch(hideLoading())
           }

            
        }
        
    // }
    


 const changeBusiness=(e)=>{
    const {name,value}=e.target
    setProfile({
        ...profile,
        [name]:value
    })

 }
const  handleInputChange=(name,value)=>{
  console.log(name,'=',value)
  if(activeTab==='address'){
    console.log('inside the address')
     setAddress({
        ...address,
        [name]:value
    })

  }else{
    console.log('inside the backn')
   setBank({
        ...bank,
        [name]:value
    })
  }

}
 const handleCancel=()=>{
  if(activeTab==='business'){
    let obj={}
    for(let key in profile){
      obj[key]=editData[key]
    }
    console.log("new obj=",obj)
    setProfile(obj)
    setBusinessLogo(editData.logo)
    setPreview(editData.logo)
    
    
  }
  if(activeTab==='address'){
      let obj={}
    for(let key in address){
      obj[key]=editData.address[key]
    }
    console.log("new obj=",obj)
    setAddress(obj)

  }
  if(activeTab==='bank'){
    console.log('bank inside in canncel functuo')
      let obj={}
    for(let key in bank){
      obj[key]=editData.bankDetails[key]
    }
    console.log("new obj=",obj)
    setBank(obj)
       console.log("bank=",bank)
  }
  
   setIsEditing(false);

 }

  const handleSave = () => {
    // console.log("Data saved:", businessData);
   
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <p className="mt-2 text-gray-600">Manage your business information</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => {
                  setActiveTab("business");
                  setIsEditing(false);
                }}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "business"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Business Details
              </button>
              <button
                onClick={() => {
                  setActiveTab("address");
                  setIsEditing(false);
                }}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "address"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Address
              </button>
              <button
                onClick={() => {
                  setActiveTab("bank");
                  setIsEditing(false);
                }}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === "bank"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Bank Details
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8">
            {/* Edit/Save Buttons */}
            <div className="flex justify-end mb-6">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Business Details Tab */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Logo Section */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Business logo"
                        className="h-32 w-32 rounded-lg object-cover border-2 border-gray-200"
                      />
                      {isEditing && (
                        <>
                          <label
                            htmlFor="logoUpload"
                            className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition-colors"
                            title="Change logo"
                          >
                            <FaCamera className="text-white text-sm" />
                          </label>
                          <input
                            type="file"
                            id="logoUpload"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Name *
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={profile.businessName}
                            onChange={(e) => changeBusiness(e)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Type *
                          </label>
                          <select
                            name="businessType"
                            value={profile?.businessType}
                            onChange={(e) => changeBusiness(e)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Email *
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => changeBusiness(e)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            name="phone"
                            type="tel"
                            value={profile?.phone}
                            onChange={(e) => changeBusiness(e)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {profile?.businessName}
                        </h2>
                        <div className="flex items-center">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {profile?.businessType}
                          </span>
                          <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {profile?.status}
                          </span>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span>{profile.email}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{profile.phone || 'Not provided'}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Business Address</h3>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street *
                      </label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleInputChange("street", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District *
                      </label>
                      <input
                        type="text"
                        value={address.district}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={address.pin}
                        onChange={(e) => handleInputChange("pin", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Street</p>
                       <p className="mt-1 text-gray-900">
  {address.street
    ? (() => {
        const parts = address.street.split(',');
        if (parts.length > 2) {
          return (
            <>
              {parts.slice(0, 2).join(',')}
              <br />
              {parts.slice(2).join(',')}
            </>
          );
        }
        return address.street;
      })()
    : 'Not provided'}
</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">City</p>
                        <p className="mt-1 text-gray-900">{address.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">State</p>
                        <p className="mt-1 text-gray-900">{address.state || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">District</p>
                        <p className="mt-1 text-gray-900">{address.district || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Country</p>
                        <p className="mt-1 text-gray-900">{address.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Postal Code</p>
                        <p className="mt-1 text-gray-900">{address.pin || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bank Details Tab */}
            {activeTab === "bank" && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Bank Account Information</h3>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bank.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch *
                      </label>
                      <input
                        type="text"
                        value={bank.branch}
                        onChange={(e) => handleInputChange("branch", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Holder Name *
                      </label>
                      <input
                        type="text"
                        value={bank.accountHolderName}
                        onChange={(e) => handleInputChange("accountHolderName", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={bank.accountNumber}
                        onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        value={bank.ifscCode}
                        onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bank Name</p>
                        <p className="mt-1 text-gray-900">{bank.bankName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Branch</p>
                        <p className="mt-1 text-gray-900">{bank.branch || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Holder</p>
                        <p className="mt-1 text-gray-900">{bank.accountHolderName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Account Number</p>
                        <p className="mt-1 text-gray-900">{bank.accountNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">IFSC Code</p>
                        <p className="mt-1 text-gray-900">{bank.ifscCode || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleBusinessProfile;