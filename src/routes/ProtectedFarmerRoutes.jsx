import {useSelector} from "react-redux"
import {Navigate, Outlet, useLocation} from "react-router-dom"

const ProtectedFarmerRoute = ({children}) => {
    const data = useSelector((state) => state.data);
    let location = useLocation();

    if(!data.isFarmer) {
        return <Navigate to="/" state={{ from: location}} replace />
    }
    return children ? children : <Outlet />;
};

export default ProtectedFarmerRoute;