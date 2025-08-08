import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Login from '../page/Login';// adjust path as needed

const RedirectRoot = () => {
  const isAuth = useSelector((state) => state.auth.isAuthenticate);
  const status = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  console.log("inside the root route")

  useEffect(() => {
    if (isAuth && status === 'pre-registration'|| status==='pending') {
        console.log("inside pre-registeration chcking")
      navigate('/Sellerinfo');
    }else if(isAuth && status==='approved')  {
      navigate('/seller')
    }
  }, [isAuth, status, navigate]);

  if (!isAuth) {
    console.log('inside authentication fails')
    return <Login />;
  }

  return null; // prevent flicker after redirect
};

export default RedirectRoot;
