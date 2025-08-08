import { useSelector } from "react-redux";
import {Navigate,Outlet} from 'react-router-dom'




const ProtectedRoute = () => {
  const isAuthenticate = useSelector((state) => state.auth.isAuthenticate);
  const status = useSelector((state) => state.auth.status);

  if (!isAuthenticate) return <Navigate to='/' replace />;

  if (
    isAuthenticate &&
    (status === 'pre-registration' || status === 'pending')
  ) {
    return <Navigate to='/Sellerinfo' replace />;
  }

  if (isAuthenticate && status === 'approved') {
    return <Outlet />;
  }

  return null; // optional fallback
};
export default ProtectedRoute
