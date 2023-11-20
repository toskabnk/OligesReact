import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import FarmerRegister from '../pages/FarmerRegister';
import CooperativeRegister from '../pages/CooperativeRegister';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Profile from '../pages/Profile';

const Routes = () => {
    return (
        <ReactRoutes>
        <Route path="/register" element={<Register/>} />
        <Route path="/register-farmer" element={<FarmerRegister/>} />
        <Route path="/register-cooperative" element={<CooperativeRegister/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/" element={<Home/>} />
        </ReactRoutes>
    )
}

export default Routes;