import * as styled from '../styles/NavBarStyles';
import { useSelector } from 'react-redux';

const Navbar =() => {  

    const name = useSelector((state) => state.user.name)
    const isAuthenticated = useSelector((state) => state.data.isAuthenticated)
    const isCooperative = useSelector((state) => state.data.isAdmin)

    return(
            <styled.NavBar>
                <styled.NavBarList>
                    <styled.NavBarItems>
                        <styled.NavBarLink to='/'>Home</styled.NavBarLink>
                    </styled.NavBarItems>
                    {isAuthenticated ? (
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
                             {/* Nada de momento */}
                            </>
                        )}
                        <styled.RightNavItem>
                            <styled.NavBarLink to='/user'>{name}</styled.NavBarLink>
                        </styled.RightNavItem><styled.RightNavItem>
                        <styled.NavBarLogout onClick={console.log('logout')}>Logout</styled.NavBarLogout>
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