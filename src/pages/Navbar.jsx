import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Stack, SvgIcon } from '@mui/material';
import Logo from '../assets/oliges_logo.svg?react';
import oligesManagementApi from '../services/apiServices';
import Swal from 'sweetalert2';
import { deleteUser } from '../redux/userSlice';
import { deleteData } from '../redux/dataSlice';
import { deleteCache } from '../redux/cacheSlice';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import TerrainIcon from '@mui/icons-material/Terrain';
import PersonIcon from '@mui/icons-material/Person';
import SummarizeIcon from '@mui/icons-material/Summarize';
import LogoutIcon from '@mui/icons-material/Logout';

const farmersPage = [
    {
        'name': 'Home',
        'url': '/',
        'icon': <HomeIcon/>,
    },
    {
        'name': 'Cooperatives',
        'url': '/cooperatives',
        'icon': <HomeIcon/>,
    },
    {
        'name': 'Receipts',
        'url': '/receipts',
        'icon': <ReceiptLongIcon/>,
    },
    {
        'name': 'Farms',
        'url': '/farms',
        'icon': <TerrainIcon/>,
    }
]
const cooperativePage = [
    {
        'name': 'Home',
        'url': '/',
        'icon': <HomeIcon/>,
    },
    {
        'name': 'Farmers',
        'url': '/farmers',
        'icon': <AgricultureIcon/>,
    },
    {
        'name': 'Receipts',
        'url': '/receipts',
        'icon': <ReceiptLongIcon/>,
    },
    {
        'name': 'Reports',
        'url': '/reports',
        'icon': <SummarizeIcon/>,
    }
]
const page = [
    {
        'name': 'Home',
        'url': '/',
        'icon': <HomeIcon/>,
    },
    {
        'name': 'Login',
        'url': '/login',
        'icon': null,
    },
    {
        'name': 'Register',
        'url': '/register',
        'icon': null,
    }
]
const setting = [
    {
        'name': 'Profile',
        'url': '/profile',
        'icon': <PersonIcon/>,
    },
    {
        'name': 'Logout',
        'url': 'logout',
        'icon': <LogoutIcon/>,
    }

]

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const name = useSelector((state) => state.user.name)
    const access_token = useSelector((state) => state.data.access_token)
    const isCooperative = useSelector((state) => state.data.isCooperative)

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (url) => {
        setAnchorElNav(null);
        navigate(url);
    };

    const handleCloseUserMenu = (url) => {
        if(url === 'logout') {
            logout();
        } else {
            navigate(url);
        }
        setAnchorElUser(null);
    };

   
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
                dispatch(deleteCache());
                Swal.fire({
                    icon: 'success',
                    title: 'Logout',
                    text: 'You have been logged out',
                    confirmButtonText: 'Ok',
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

  return (
    <AppBar position="static">
        <Toolbar disableGutters>
            <SvgIcon sx={{ color: 'black', fontSize: 60, display: { xs: 'none', md: 'flex' }, mr: 1 }} component={Logo} inheritViewBox />
            <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'system-ui',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}>
                    Oliges
            </Typography>
            {/* Mobile menu view */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit">
                        <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={() => handleCloseNavMenu(null)}
                    sx={{display: { xs: 'block', md: 'none' }}}>
                        {access_token ? 
                            isCooperative ?
                                cooperativePage.map((option) => (
                                    <MenuItem key={option.name} onClick={() => handleCloseNavMenu(option.url)}>
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            {option.icon}
                                            <Typography textAlign="center">{option.name}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))
                            :
                                farmersPage.map((option) => (
                                    <MenuItem key={option.name} onClick={() => handleCloseNavMenu(option.url)}>
                                        <Stack direction="row" alignItems="center" gap={1}>
                                            {option.icon}
                                            <Typography textAlign="center">{option.name}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))
                        :
                        page.map((option) => (
                            <MenuItem key={option.name} onClick={() => handleCloseNavMenu(option.url)}>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    {option.icon}
                                    <Typography textAlign="center">{option.name}</Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                </Menu>
            </Box>
            {/*End Mobile menu view */}
            <SvgIcon sx={{ color: 'black', fontSize: 60, display: { xs: 'flex', md: 'none' }, mr: 1 }} component={Logo} inheritViewBox />
            <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'system-ui',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}>
                Oliges
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } , justifyContent: 'center'}}>
            {access_token ? 
                isCooperative ?
                    cooperativePage.map((page) => (
                        <Button
                            startIcon={page.icon}
                            key={page.name}
                            onClick={() => handleCloseNavMenu(page.url)}
                            sx={{ my: 2, color: 'white', marginRight: 2}}>
                            {page.name}
                        </Button>
                    ))
                    :
                    farmersPage.map((page) => (
                        <Button
                            startIcon={page.icon}
                            key={page.name}
                            onClick={() => handleCloseNavMenu(page.url)}
                            sx={{ my: 2, color: 'white', marginRight: 2}}>
                            {page.name}
                        </Button>
                    )) 
                :
                page.map((page) => (
                    <Button
                        startIcon={page.icon}
                        key={page.name}
                        onClick={() => handleCloseNavMenu(page.url)}
                        sx={{ my: 2, color: 'white', marginRight: 2}}>
                        {page.name}
                    </Button>
                ))}
            </Box>
            {/* User menu */
            access_token ?
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'system-ui',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'white',
                                    textDecoration: 'none',
                                }}>
                                {name}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={() => handleCloseUserMenu(null)}>
                        {setting.map((option) => (
                            <MenuItem key={option.name} onClick={() => handleCloseUserMenu(option.url)}>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    {option.icon}
                                    <Typography textAlign="center">{option.name}</Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box> : null
            }
        </Toolbar>
    </AppBar>
  );
}
export default Navbar;