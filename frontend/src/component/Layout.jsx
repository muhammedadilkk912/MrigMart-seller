import { useEffect, useRef, useState } from 'react';
import { FaHome, FaBell } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { BsPencilSquare } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { MdReviews } from "react-icons/md";
import { PiFlagBannerFold } from "react-icons/pi";
import { FaUsersLine } from "react-icons/fa6";





import { Link ,Outlet, useLocation, useNavigate} from 'react-router-dom';
import { SlLogout } from "react-icons/sl";
import Alert from './Alert';
import {toast} from 'react-hot-toast'
import {useDispatch, useSelector} from 'react-redux'
import {showLoading,hideLoading} from '../Redux/LoadingSlic'
import axiosInstance from '../configure/axios';
import Spinner from './Spinner';
import {Logout} from '../Redux/authSlic'

const Layout = () => {
  const dispatch=useDispatch()
  
  const isAuth= useSelector((state) => state.auth.isAuthenticate);
  const isLoading=useSelector((state)=>state.loading.isLoading)
  const logo=useSelector((state)=>state.auth.logo)

  // console.log("llllllll=",isLoading);
  console.log("logo=",logo)
  
  const navigate=useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location=useLocation()
  // const [activeItem, setActiveItem] = useState('Dashboard');
  const [logout,setLogout]=useState(false)
  const [dropdown,setDropdown]=useState(false)
   const dropdownRef = useRef(null); 
   const [mobileSidebar,setMobileSidebar]=useState(false)
  const handleCancel=()=>{
    console.log("inside the cancel")

    setLogout(false)
    navigate('/seller') 
    
  }
  
    // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (dropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdown]); // 
  

    
  const handleLogout=async()=>{

    try {
      console.log("inside the handleLogout")
       dispatch(showLoading()) 
      const response=await axiosInstance.post('/seller/logout')
      console.log("logout",response)
      toast.success(response?.data?.message)
     
      
       navigate('/')
        console.log("bbefore logut .............................")
       dispatch(Logout()) 
     

    } catch (error) {
      console.log("error in logout =",error)
    }finally{
     
       dispatch(hideLoading())
       func()
    }
     
      
  }  
  const func=()=>{
    setTimeout(() => {
             console.log("isauth=",isAuth)

      
    }, 2000);
  }

  // Sidebar menu items
  
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome className="text-lg"/>, path:'/seller'},
    // { name: 'Users', icon: <FaRegUser className="text-lg" /> },
    { name: 'Products', icon: <AiFillProduct className="text-lg"/> ,path:'/seller/products'  },
    {name:'Orders' ,icon:<BsPencilSquare className='text-lg'/>,path:'/seller/orders'   },
    {name:'Customers',icon:<FaUsersLine  className='text-lg'/>, path:'/seller/customers'},
    {name:'Banner',icon:<PiFlagBannerFold  className='text-lg'/> , path:'/seller/banner'},
    {name:'Reviews',icon:<MdReviews  className='text-lg'/>, path:'/seller/reviews'},
    {name:'Profile',icon:<CgProfile  className='text-lg'/>, path:'/seller/profile'},
     {name:'Logout',icon:<SlLogout className='text-lg'/> ,isLogout:true},
     
  
  ];
  console.log("mobile sidebar=",mobileSidebar)

  return (
     
    <div className="flex h-screen bg-red-100 overflow-hidden">
      {/* Mobile sidebar toggle */}
      {/* {
        !sidebarOpen &&(
          <button 
          className='bg-red-500 h-10'
          type="button">
            <FiMenu className="text-xl" />

          </button>
        )
      } */}
      {/* {
        !sidebarOpen&&(
           <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`block sm:hidden fixed   left-4 top-2 z-30 p-2 rounded-md bg-red-200 text-black`}
      >
        
      </button> */}

     

      {/* Sidebar */}
      <div 
        className={ ` hidden sm:block bg-white border-r fixed top-0 left-0 border-gray-300 text-gray-300 transition-all duration-300 ease-in-out 
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
         md:relative h-full z-30`}
       >
        <div className="p-4 flex items-center justify-between h-16">
          {sidebarOpen && (
            <h1 className="text-xl  text-blue-500 font-bold whitespace-nowrap">MrigMart</h1>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            // className="text-black bg-gray-300 focus:outline-none hidden md:block"
            className=" text-black rounded  p-1 bg-gray-200"
          >
           <FiMenu className='h-6 w-6'/>
          </button>
        </div>
        
        <nav className="mt-5   ">
          {menuItems.map((item) => {
            
            const isActive=location.pathname===item.path
            return(
              <Link
              to={item.isLogout?'#':item.path}
              key={item.name}
              onClick={()=>{
                // setSidebarOpen(false)
                if(item.isLogout){
                  setLogout(true)
                }
              }}
              className={`flex  items-center px-3 py-3  rounded-full mx-2 my-2  cursor-pointer transition-colors duration-200 
                ${isActive ? 'bg-gray-100  text-blue-500' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}
            >
               <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}

            </Link>

            );
          })}
            {/* <Link
              to={item.path}
              key={item.name}
              className={`flex  items-center px-3 py-3  rounded-full mx-2 my-2  cursor-pointer transition-colors duration-200 
                ${activeItem === item.name ? 'bg-gray-100  text-blue-500' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}
            >
              <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            
            </Link> */}


        </nav>
      </div>

      {/* mobile side bar */}
      {
        mobileSidebar && (
          <div 
        className={ ` block sm:hidden bg-white border-r fixed top-0 left-0 border-gray-300 text-gray-300 transition-all duration-300 ease-in-out 
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
         md:relative h-full z-30`}
       >
        <div className="p-4 flex items-center justify-between h-16">
          {sidebarOpen && (
            <h1 className="text-xl  text-blue-500 font-bold whitespace-nowrap">MrigMart</h1>
          )}
          <button 
            onClick={() => setMobileSidebar(!mobileSidebar)}  
            // className="text-black bg-gray-300 focus:outline-none hidden md:block"
            className=" text-black rounded  p-1 bg-gray-200"
          >
           <FiMenu className='h-6 w-6'/>
          </button>
        </div>
        
        <nav className="mt-5   ">
          {menuItems.map((item) => {
            
            const isActive=location.pathname===item.path
            return(
              <Link
              to={item.isLogout?'#':item.path}
              key={item.name}
              onClick={()=>{
                setMobileSidebar(false)
                // setSidebarOpen(false)
                if(item.isLogout){
                  setLogout(true)
                }
              }}
              className={`flex  items-center px-3 py-3  rounded-full mx-2 my-2  cursor-pointer transition-colors duration-200 
                ${isActive ? 'bg-gray-100  text-blue-500' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}
            >
               <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}

            </Link>

            );
          })}
            {/* <Link
              to={item.path}
              key={item.name}
              className={`flex  items-center px-3 py-3  rounded-full mx-2 my-2  cursor-pointer transition-colors duration-200 
                ${activeItem === item.name ? 'bg-gray-100  text-blue-500' : 'hover:bg-gray-100 text-gray-400 hover:text-blue-500'}`}
            >
              <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`}>{item.icon}</span>
              {sidebarOpen && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            
            </Link> */}


        </nav>
      </div>

        )
      }
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between sm:justify-end px-6 py-4 h-16">
            <div className='bg-gray-200 flex justify-center rounded px-1 py-0.5'>
              <button
              onClick={() => setMobileSidebar(!mobileSidebar)}   
              >
              <FiMenu className='w-5 h-5'/>
            </button>

            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100">
                <FaBell className="text-indigo-600 text-lg" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
             <div className="flex relative items-center space-x-2"  ref={dropdownRef}>
  <img 
    src={logo ? logo : "/user.png"}
    onClick={() => setDropdown(!dropdown)}
    alt="Profile" 
    className="h-8 w-8 rounded-full object-cover border-2 border-indigo-500 cursor-pointer"
  />
  
  {dropdown && (
    <div className="absolute right-0 top-10 z-50 min-w-[120px] bg-white rounded-md shadow-lg py-1 border border-gray-200">
      <p onClick={()=>{
        navigate('/seller/profile')
        setDropdown(false)
      }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Profile</p>
      <p onClick={()=>{
        setLogout(true),
        setDropdown(false)
      }} className="px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer">Logout</p>
    </div>
  )}
</div>
            </div>
          </div>    
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gray-100">
           <Outlet />
           {
            logout&& <Alert oncanCel={handleCancel} onLogout={handleLogout}/>

            
           }
           {
        isLoading&&<Spinner/>
      }
        </main>
      </div>
      
    </div>
  );
};

export default Layout;