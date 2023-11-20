import Swal from 'sweetalert2';
import { deleteData } from '../redux/dataSlice';
import { deleteUser } from '../redux/userSlice';
import oligesManagementApi from '../services/apiServices';
import * as styled from '../styles/NavBarStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Navbar =() => {  

    const name = useSelector((state) => state.user.name)
    const access_token = useSelector((state) => state.data.access_token)
    const isCooperative = useSelector((state) => state.data.isCooperative)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function logout() {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                logoutUser();
            }
        })
    }

    async function logoutUser() {
        Swal.fire({
            title: 'Logging out...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })
        oligesManagementApi.post('logout', '', { bearerToken: access_token })
            .then((response) => {
                Swal.close();
                dispatch(deleteUser());
                dispatch(deleteData());
                Swal.fire({
                    icon: 'success',
                    title: 'Logout',
                    text: 'You have been logged out',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/');
                    }
                })
            })
            .catch((error) => {
                Swal.close();
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    confirmButtonText: 'Ok',
                })
            })
    }

    return(
            <styled.NavBar>
                <styled.NavBarList>
                    <styled.NavBarItems>
                        <styled.NavBarLink to='/'>Home</styled.NavBarLink>
                    </styled.NavBarItems>
                    {access_token ? (
                    <>
                        {isCooperative ? (
                            <>
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/'>Farmers</styled.NavBarLink>
                                </styled.NavBarItems>
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/'>Receipts</styled.NavBarLink>
                                </styled.NavBarItems>
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/'>Estadistics</styled.NavBarLink>
                                </styled.NavBarItems>
                            </>
                        ) : (
                            <>
                             <styled.NavBarItems>
                                    <styled.NavBarLink to='/'>Receipts</styled.NavBarLink>
                                </styled.NavBarItems>
                                <styled.NavBarItems>
                                    <styled.NavBarLink to='/'>Estadistics</styled.NavBarLink>
                                </styled.NavBarItems>
                            </>
                        )}
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/profile'>{name}</styled.NavBarLink>
                        </styled.RightNavItem><styled.RightNavItem>
                        <styled.NavBarLogout onClick={logout}>Logout</styled.NavBarLogout>
                        </styled.RightNavItem>
                    </>
                    ):(
                    <>
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/login'>Login</styled.NavBarLink>
                        </styled.RightNavItem><styled.RightNavItem>
                            <styled.NavBarLink to='/register'>Register</styled.NavBarLink>
                        </styled.RightNavItem>
                    </>
                    )}
                </styled.NavBarList>
            </styled.NavBar>
    );
    
}

export default Navbar;