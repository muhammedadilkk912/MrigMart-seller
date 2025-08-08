import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiUser ,FiEyeOff, FiLock, FiMail, FiShoppingBag } from 'react-icons/fi';
import {toast} from 'react-toastify';
import axiosInstance from '../configure/axios.js'
import Otp from '../component/Otp.jsx';

const Registeration = () => {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [open,setOpen]=useState(false)
  const [loading,setLoading]=useState(false)
  // const [otp,setOtp]=useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  console.log("erros---",errors)

  const validateForm = () => {

    console.log("inside the validation")   
    // const newErrors = {};
    setErrors(null)  
    let emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if(!formData.name.trim()){
      toast.error("name is required")
      setErrors({name:true})
      return false
    }

    if(!formData.email.trim()){
      toast.error("email is required")
      setErrors({email:"bdsdjb"})
      return false

    }else if(!emailRegex.test(formData.email)){
       toast.error("enter proper email format")
      setErrors({email:"bdsdjb"})
      return false

    }

    if(!formData.password.trim()){
      toast.error("password is required")
      setErrors({password:'ndsj'})
      return false
    }else if(formData.password.length<6){
      toast.error("minimum 6 characters needed ")
      setErrors({password:'ndsj'})
      return false
      
    }else if(formData.password.length>10){
      toast.error("maximum 10 characters allowed")
      setErrors({password:'ndsj'})
      return false
    }
    if(!formData.confirmPassword.trim()){
      toast.error("confirmPassword is required")
      setErrors({confirmPassword:'ndsj'})
      return false
    }
    else if(formData.password!==formData.confirmPassword){
        toast.error("confirmPassword and password not same")
      setErrors({confirmPassword:'ndsj'})
      return false

    }
    return true
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(!isLoading);
      // Handle registration logic here     
      console.log('Registration data:', formData);
      try {
        const response=await axiosInstance.post('/auth/registeration',formData )  
        console.log(response)
        // setOtp(response?.data?.otp)
        toast.success(response?.data.message)
       setOpen(!open)
      } catch (error) {
        console.log("error in registeration =",error)
        toast.error(error?.response?.data?.message)
        
      }finally{
        setIsLoading(false)  
      }
     
    }
  };

  const otpsubmit=async(otp)=>{
    try {
      console.log("data=",formData)
      console.log("otp=",otp)  
      if(!otp || !formData){ 
        return toast.error("internal error")
      }
      setLoading(!loading)
       const response=await axiosInstance.post('/auth/Verify-otp',{email:formData.email,otp})
       console.log("respone=",response)
       toast.success(response?.data?.message)
       navigate('/')
       
    } catch (error) {
      console.log("error verify otp=",error) 
      toast.error(error?.response?.data?.message)

    }finally{
      setLoading(false)
    }

  }

  // const resentOtp=async()=>{
  //   try {

  //     const response=await axiosInstance.post('/auth/resent')
      
  //   } catch (error) {
      
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {
        open?<Otp  otpsubmit={otpsubmit} loading={loading} setLoading={setLoading} email={formData.email} />:(
          <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white mb-4">
            <FiShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Seller Account</h2>
          <p className="mt-2 text-gray-600">Start managing your e-commerce business</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors?.name ? 'border-red-500 border-2' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="ben john "
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors?.email ? 'border-red-500 border-2' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="your@business.com"
                  />
                </div>
                {/* {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>} */}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors?.password ?  'border-red-500 border-2': 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {/* {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>} */}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors?.confirmPassword ?  'border-red-500 border-2' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {/* {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>} */}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-6 rounded-b-xl border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/seller-login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Your E-Commerce Platform. All rights reserved.</p>
        </div>
      </div>
        )
      }
      
      
    </div>
  );
};

export default Registeration;