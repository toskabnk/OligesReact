import { Button } from "@mui/material";
import { useLocation } from "react-router";

const NavBarButton = ({ element, handleCloseNavMenu }) => {
    const location = useLocation();

    return (
        <Button
            startIcon={element.icon}
            onClick={() => handleCloseNavMenu(element.url)}
            style={{
                fontWeight: location.pathname === element.url ? 700 : 400,
                color: location.pathname === element.url ? 'black' : 'white',
                backgroundColor: location.pathname === element.url ? 'white' : 'transparent',
            }}
            sx={{ my: 2, color: 'white', marginRight: 2}}>
            {element.name}
        </Button>
    )
}

export default NavBarButton;