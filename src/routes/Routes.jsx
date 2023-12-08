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
import ReceiptRegister from '../pages/ReceiptRegister';
import Cooperatives from '../pages/Cooperatives';
import Farms from '../pages/Farms';
import ProtectedRoute from './ProtectedRoute';
import ProtectedFarmerRoute from './ProtectedFarmerRoutes';
import ProtectedCooperativeRoute from './ProtectedCooperativeRoutes';
import IsLoggedRoute from './IsLoggedRoutes';
import Reports from '../pages/Reports';

const Routes = () => {
    return (
        <ReactRoutes>
            {/* Not Logged Routes*/}
            <Route element={<IsLoggedRoute/>}>
                <Route path="/register" element={<Register/>} />
                <Route path="/register-farmer" element={<FarmerRegister/>} />
                <Route path="/register-cooperative" element={<CooperativeRegister/>} />
                <Route path="/login" element={<Login/>} />
            </Route>
            {/* Logged Routes*/}
            <Route  element={<ProtectedRoute/>} >
                {/* Cooperative Only Routes*/}
                <Route element={<ProtectedCooperativeRoute/>}>
                    <Route path="/receipt-register" element={<ReceiptRegister/>} />
                    <Route path="/farmers" element={<Farmers/>} />
                </Route>
                {/* Farmer Only Route*/}
                <Route path="/farms" element={<ProtectedFarmerRoute><Farms/></ProtectedFarmerRoute>} />
                {/* Shared Routes*/}
                <Route path="/profile" element={<Profile/>} />
                <Route path="/receipts" element={<Receipts/>} />
                <Route path="/receipt-details" element={<ReceiptDetails/>} />
                <Route path="/cooperatives" element={<Cooperatives/>} />
                <Route path="/reports" element={<Reports/>} />
            </Route>
            {/* Home Route*/}
            <Route path="/" element={<Home/>} />
        </ReactRoutes>
    )
}

export default Routes;