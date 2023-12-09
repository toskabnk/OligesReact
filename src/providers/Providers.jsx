import { Provider } from "react-redux";
import { store } from "../redux/store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import theme from "../theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledProvider } from "styled-components";

const Providers = ({children}) => {
    return (
        <StyledProvider theme={theme}>
            <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Provider store={store}>
                        {children}
                    </Provider>
                </LocalizationProvider>
            </ThemeProvider>
        </StyledProvider>
    )
}

export default Providers;