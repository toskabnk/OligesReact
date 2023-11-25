import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import FarmerRegister from '../pages/FarmerRegister';
import CooperativeRegister from '../pages/CooperativeRegister';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import Farmers from '../pages/Farmers';
import Receipts from '../pages/Receipts';
import ReceiptDetails from '../pages/ReceiptDetails';

const Routes = () => {
    return (
        <ReactRoutes>
        <Route path="/register" element={<Register/>} />
        <Route path="/register-farmer" element={<FarmerRegister/>} />
        <Route path="/register-cooperative" element={<CooperativeRegister/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/farmers" element={<Farmers/>} />
        <Route path="/receipts" element={<Receipts/>} />
        <Route path="/receipt-details" element={<ReceiptDetails/>} />
        <Route path="/" element={<Home/>} />
        </ReactRoutes>
    )
}

export default Routes;