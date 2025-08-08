import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./page/Login";
import Registeration from "./page/Registeration";
import { ToastContainer } from "react-toastify";
import Forgetpas from "./page/Forgetpas";
import { Toaster } from "react-hot-toast";
import SellingInfo from "./page/SellingInfo";
import { setAuthentication } from "./Redux/authSlic";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axiosInstance from "./configure/axios";
import BusinessReg from "./page/BusinessReg";
import RedirectRoot from "./component/RedirectRoot";
import ProtectedRoute from "./component/ProtectedRoute";
import Layout from "./component/Layout";
import Dash from "./page/Dash";
import Addproduct from "./page/Addproduct";
import Products from "./page/Products";
import Order from "./page/Order";
import Profile from "./page/Profile";
import Banner from "./page/Banner";
import Spinner from "./component/Spinner";
import { showLoading, hideLoading } from "./Redux/LoadingSlic";
import SingleOrderPage from "./page/SingleOrderPage";
import Review from './page/Review'
import CustomersPage from "./page/Customer";
import ProductDetailPage from "./page/ProductDetailPage";
import News from "./page/news";
const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticate = useSelector((state) => state.auth.isAuthenticate);
  const status = useSelector((state) => state.auth.status);
  const loading = useSelector((state) => state.loading.isLoading);
  
  // console.log(status, isAuthenticate);

  useEffect(() => {
    if (!isAuthenticate) {
      
      checkauth();
    }
  }, [isAuthenticate]);

  const checkauth = async () => {
    try {
      console.log("inside the checkauth auth");
      const response = await axiosInstance.get("/auth/checkauth");
      console.log("response=", response);
      dispatch(setAuthentication(response?.data?.status));
     
    } catch (error) {
      console.log("errror in checkauth =", error);
     
       navigate('/')
    }
  };
  console.log("status=",status)
  console.log("authication=",isAuthenticate)
  // if (loading ) {
  //   return (
  //     <div className="min-h-screen w-full">
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Toaster />
      <ToastContainer position="top-center" autoClose="2000" />
      <Routes>
        <Route path="/" element={<RedirectRoot/>} />
        <Route path="/registeration" element={<Registeration />} />
        <Route path="/forgetpassword" element={<Forgetpas />} />

         <Route path="/business_reg" element={<BusinessReg />} />
         <Route path="/Sellerinfo" element={<SellingInfo />} />
       
        <Route element={<ProtectedRoute />}>
                 
          <Route path="/Seller" element={<Layout />}>
            <Route index element={<Dash />} />
            <Route path="products" element={<Products />} />
            <Route path="Addproduct" element={<Addproduct />} />
            <Route path="editproduct/:id" element={<Addproduct />} />
            <Route path="orders" element={<Order />} />
            <Route path="profile" element={<Profile />} />
            <Route path="banner" element={<Banner />} />
            <Route path='orders/:id/:productId' element={<SingleOrderPage/>}/>
            <Route path="reviews" element={<Review/>} />
            <Route path="customers" element={<CustomersPage/>}/>
            <Route path="products/:id" element={<ProductDetailPage/>} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
