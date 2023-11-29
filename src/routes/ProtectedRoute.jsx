import {useSelector} from "react-redux"
import {Navigate, Outlet, useLocation} from "react-router-dom"

const ProtectedRoute = ({children}) => {
    const user = useSelector((state) => state.user);
    let location = useLocation();

    if(!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;