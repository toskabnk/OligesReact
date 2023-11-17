import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import FarmerRegister from '../pages/FarmerRegister';
import CooperativeRegister from '../pages/CooperativeRegister';
import Register from '../pages/Register';

const Routes = () => {
    return (
        <ReactRoutes>
        <Route path="/register" element={<Register/>} />
        <Route path="/farmer-register" element={<FarmerRegister/>} />
        <Route path="/cooperative-register" element={<CooperativeRegister/>} />
        <Route path="/" element={<Home/>} />
        </ReactRoutes>
    )
}

export default Routes;