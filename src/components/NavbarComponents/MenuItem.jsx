import { MenuItem, Stack, Typography } from "@mui/material";
import { useLocation } from "react-router";

const NavBarMenuItem = ({ option, handleCloseNavMenu }) => {
    const location = useLocation();

    return (
        <MenuItem onClick={() => handleCloseNavMenu(option.url)}>
            <Stack direction="row" alignItems="center" gap={1}>
                {option.icon}
                <Typography 
                    textAlign="center"
                    style={{
                        fontWeight: location.pathname === option.url ? 800 : 400,
                        textDecoration: location.pathname === option.url ? 'underline' : 'none',
                    }}>
                        {option.name}
                </Typography>
            </Stack>
        </MenuItem>
    );
}

export default NavBarMenuItem;