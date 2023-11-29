import {useSelector} from "react-redux"
import {Navigate, Outlet, useLocation} from "react-router-dom"

const ProtectedCooperativeRoute = ({children}) => {
    const data = useSelector((state) => state.data);
    let location = useLocation();

    if(!data.isCooperative) {
        return <Navigate to="/" state={{ from: location}} replace />
    }
    return children ? children : <Outlet />;
};

export default ProtectedCooperativeRoute;