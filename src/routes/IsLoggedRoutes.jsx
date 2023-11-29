import {useSelector} from "react-redux"
import {Navigate, Outlet, useLocation} from "react-router-dom"

const IsLoggedRoutes = ({children}) => {
    const user = useSelector((state) => state.user);
    let location = useLocation();

    if(user.isAuthenticated) {
        return <Navigate to="/" state={{ from: location}} replace />
    }
    return children ? children : <Outlet />;
};

export default IsLoggedRoutes;