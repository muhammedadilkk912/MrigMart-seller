import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiMail, FiShoppingBag } from "react-icons/fi";
import {useDispatch} from 'react-redux'
import {setLogo}  from '../Redux/authSlic'
import {toast } from 'react-hot-toast'
import { useRef } from "react";
import axiosInstance from '../configure/axios'
import { login } from "../Redux/authSlic";

const Login = () => {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 const [errors,setErrors]=useState({})

  const validation = () => {
    // console.log("the data=", data);
    setErrors({})

    console.log("inside the validation");

    let flag = true;
    if (!email.trim()) {
      toast.error("email is required");
         setErrors({...errors,email:"ksakdj"})

      return (flag = false);
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("invalid email format");
              setErrors({...errors,email:"ksakdj"})

      return (flag = false);
    }
    if (!password.trim()) {
      toast.error("password is required");
      setErrors({...errors,password:"sknndf"})
      return (flag = false);
    }
    

    return flag;
  };

  const handleSubmit = async(e) => {
    console.log("inside  the validation")
    e.preventDefault();
    const validate=validation()
    if(validate){

      try {
        setIsLoading(true);
        const response=await axiosInstance.post('/auth/signin',{email,password})
        console.log(response)
        toast.success(response?.data?.message)
        let status=response?.data?.status
        dispatch(login(status))
        if(response?.data?.logo !== ''){
         
          let logo=response?.data?.logo
           console.log('insid check logo',logo)
          dispatch(setLogo(logo))
        }
        navigate('/Sellerinfo')
      } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error);
        
        
      }finally{
        setIsLoading(false)

      }
    }
    

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-600 text-white mb-4">
            <FiShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Seller Portal</h2>
          <p className="mt-2 text-gray-600">Manage your e-commerce business</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                   
                    
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 ${errors.email?"border-2 border-red-500":"border border-gray-300"}  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="your@business.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"

                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3  ${errors.password?"border-2 border-red-500":"border  border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember this device
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgetpassword"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
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
                      Signing in...
                    </>
                  ) : (
                    "Sign in to dashboard"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 px-8 py-6 rounded-b-xl border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              New to our platform?{" "}
              <Link
                to="/registeration"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create seller account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} Your E-Commerce Platform. All rights
            reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
