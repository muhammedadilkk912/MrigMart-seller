import React, { useEffect, useState } from "react";
import axiosInstance from "../configure/axios";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import {useDispatch} from 'react-redux'
import { showLoading,hideLoading } from "../Redux/LoadingSlic";
import { setLogo } from "../Redux/authSlic";


const SimpleBusinessProfile = () => {
  
  const dispatch=useDispatch()
  
  const [activeTab, setActiveTab] = useState("business");
  const [isEditing, setIsEditing] = useState(false);
  const [editData,SetEditData]=useState({})
  const [logo,setlogo]=useState() 
  const [preview,setPreview]=useState()
  // Business data state
  const [profile, setProfile] = useState({
    
      businessName: "",
      businessType: "",
      phone: "",
      email: "",
      phone: "",
      status: "",
     });
  const [address,setAddress]=useState({
     street: "123 Business Ave",
      city: "New York",
      state: "NY",
      district: "10001",
      country: "USA",
      pin: "",

  })
  const [bank,setBank]=useState({
       accountHolderName: '',
    accountNumber: '',
    bankName:'',
    ifscCode: '',    
    branch:''
  })
  console.log("Bank=",bank)
  useEffect(() => {
    getprofile();
  }, []);
  const getprofile = async () => {
    try {
      dispatch(showLoading())
      const response = await axiosInstance.get("/seller/getprofile");
      let data = response?.data.profile;
      console.log(response);
      setProfile({
        ...profile,
        businessName: data.businessName,
        businessType: data.businessType,
        status: data.status,
        email: data.email,
        phone:data.phone
      });
      setAddress({
         street: data.address.street,
      city:  data.address.city,
      state:  data.address.state,
      district:  data.address.district,
      country: data.address.country,
      pin:  data.address.pin,

      })
      setBank({
          accountHolderName: data.bankDetails.accountHolderName,
    accountNumber: data.bankDetails.accountNumber,
    bankName:data.bankDetails.bankName,
    ifscCode: data.bankDetails.ifscCode,    
    branch:data.bankDetails.branch 
      })  
      setlogo(data?.logo)
       let lc=data.logo
      dispatch(setLogo(lc))

      setPreview(data?.logo)
      SetEditData(data)
    } catch (error) {
      console.log("error in get profile=", error);
    }finally{
      dispatch(hideLoading())
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
          setlogo(file)
          
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
         let imageCheck=editData.logo !== logo?false:true
        //  console.log(logo,"=",editData.logo)
        //  console.log("imageCheck=",imageCheck)
         if(!change&&imageCheck ){
             toast.warning("no changes are happen")
             return null
          }
         if(!imageCheck){
           formData.append('image',logo)
         }
         

          console.log("change=",change)
          console.log(change,"+++",imageCheck)
          if(change && bus_validation()){
            formData.append('profile',JSON.stringify(profile))
          }
          // return null
          // console.log(bus_validation())
          // return null
          console.log(logo)
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
    setlogo(editData.logo)
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
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-3xl mx-auto  rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Business Profile</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-300 bg-white/90 hover:bg-whit">
          <button
            onClick={() => {setActiveTab("business")      
              setIsEditing(false)
            }}
            className={`px-6 py-3 font-medium ${
              activeTab === "business"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Business Details
          </button>
          <button
            onClick={() => {setActiveTab("address")
              setIsEditing(false)

            }}
            className={`px-6 py-3 font-medium ${
              activeTab === "address"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Address
          </button>
          <button
            onClick={() =>{ setActiveTab("bank")
              setIsEditing(false)
            }}
            className={`px-6 py-3 font-medium ${
              activeTab === "bank"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Bank Details
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white/60 hover:bg-white">
          {/* Edit/Save Buttons */}
          <div className="flex justify-end mb-6">
            {isEditing ? (
              <div className="space-x-3">
                <button
                  onClick={ handleCancel}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>

          {/* Business Details Tab */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <img
                    src={preview}
                    alt="Business logo"
                    className="h-24 w-24 rounded-lg object-cover border"
                  />

                  {isEditing && (
                    <>
                      <label
                        htmlFor="logoUpload"
                        className="absolute bottom-0 right-0 bg-black p-2 rounded-full cursor-pointer"
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

                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={profile.businessName}
                          onChange={(e) =>
                            changeBusiness(e)
                          }
                          className="mt-1 w-full p-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Business Type
                        </label>
                        <select
                        name="businessType"
                          
                          value={profile?.businessType}
                          onChange={(e) =>
                            changeBusiness(e)
                          }
                          className="mt-1 w-full p-2 border rounded-md"
                        >
                          <option value="">
                            {profile?.businessType
                              ? profile.businessType
                              : "select the field"}
                          </option>
                          <option value="Sole Proprietorship">
                            Sole Proprietorship
                          </option>
                          <option value="Partnership">Partnership</option>
                          <option value="LLC">LLC</option>
                          <option value="Corporation">Corporation</option>
                          <option value="Nonprofit">Nonprofit</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Business Email
                        </label>
                        <input
                         name="email"
                          type="text"
                          value={profile.email}
                          onChange={(e) =>
                            changeBusiness(e)
                          }
                          className="mt-1 w-full p-2 border rounded-md"
                        />
                      </div>
                      {/* <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Status
  </label>
  <div className="flex items-center gap-4">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="status"
        value="active"
        defaultChecked={profile?.status === 'active'}
        className="form-radio h-4 w-4 text-blue-600"
      />
      <span className="ml-2 text-gray-700">Active</span>
    </label>

    <label className="inline-flex items-center">
      <input
        type="radio"
        name="status"
        value="inactive"
        defaultChecked={profile?.status === 'inactive'}
        className="form-radio h-4 w-4 text-red-600"
      />
      <span className="ml-2 text-gray-700">Inactive</span>
    </label>
  </div>
</div> */}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone number
                        </label>
                        <input
                          name="phone"
                          type="text"
                          value={profile?.phone}
                          onChange={(e) =>
                           changeBusiness(e)
                          }
                          className="mt-1 w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold">
                        {profile?.businessName}
                      </h2>
                      <p className="text-gray-600">{profile?.businessType}</p>
                      <div className="mt-4 space-y-1">
                        <p>{profile.email}</p>
                        <p>{profile.phone || '9887'}</p>
                        <p className="inline my-2 px-2 rounded-full py-1 bg-green-400 text-white ">{profile?.status}</p>
                       {/* <span className="text-gray-500 inline">Status : <p className=" flex justify-center bg-green-500 text-white rounded px-2">{profile?.status}</p></span> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* <div>
                <h3 className="font-medium mb-2">Description</h3>
                {isEditing ? (
                  <textarea
                    value={businessData.business.description}
                    onChange={(e) => handleInputChange('business', 'description', e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                ) : (
                  <p>{businessData.business.description}</p>
                )}
              </div> */}
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Street
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) =>
                        handleInputChange("street", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        handleInputChange( "state", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                     District
                    </label>
                    <input
                      type="text"
                      value={address.district}
                      onChange={(e) =>
                        handleInputChange( "district", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) =>
                        handleInputChange( "country", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      pin
                    </label>
                    <input
                      type="text"
                      value={address.pin}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Business Address</p>
                  <p>{address.street}</p>
                  <p>
                    {address.city}, {address.state}{" "}
                    {address.district}
                  </p>
                  <p>{address.country}</p>
                  <p>{address.pin}</p>
                </div>
              )}
            </div>
          )}

          {/* Bank Details Tab */}
          {activeTab === "bank" && (
            <div className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bank.bankName}
                      onChange={(e) =>
                        handleInputChange("bankName", e.target.value)
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {" "}
                      Branch
                    </label>
                    <input
                      type="text"
                      value={bank.branch}
                      onChange={(e) =>
                        handleInputChange(
                         
                          "branch",  
                          e.target.value
                        )
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {" "}
                      Account number
                    </label>
                    <input
                      type="text"
                      value={bank.accountNumber}
                      onChange={(e) =>
                        handleInputChange(
                         
                          "accountNumber",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {" "}
                      Account holder name
                    </label>
                    <input
                      type="text"
                      value={bank.accountHolderName}
                      onChange={(e) =>
                        handleInputChange(
                         
                          "accountHolderName",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {" "}
                      Account number
                    </label>
                    <input
                      type="text"
                      value={bank.branch}
                      onChange={(e) =>
                        handleInputChange(
                         
                          "accountNumber",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div> */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700"> Account Holder Name</label>
                    <input
                      type="text"
                      value={profile.bank.accountHolder}
                      onChange={(e) => handleInputChange('bank', 'routingNumber', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div> */}
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">IFSC code</label>
                    <input
                      type="text"
                      value={bank.ifscCode}
                      onChange={(e) => handleInputChange( 'ifscCode', e.target.value)}
                      className="mt-1 w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Bank Information</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p>{bank.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Branch</p>
                      <p>{bank.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p>{bank.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account holder name </p>
                      <p>{bank.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IFSC code</p>
                      <p>{bank.ifscCode}</p>
                    </div>
                  </div>
                  {/* <div className="pt-2">
                    <p className="text-sm text-gray-500">Account Holder</p>
                    <p>{businessData.bank.accountHolder}</p>
                  </div> */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleBusinessProfile;
