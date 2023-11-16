import { Routes as ReactRoutes, Route } from 'react-router-dom';
import Home from '../pages/Home'
import Register from '../pages/Register';

const Routes = () => {
    return (
        <ReactRoutes>
        <Route path="/register" element={<Register/>} />
        <Route path="/" element={<Home/>} />
        </ReactRoutes>
    )
}

export default Routes;