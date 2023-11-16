import { Provider } from "react-redux";
import { store } from "../redux/store";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Providers = ({children}) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
                {children}
            </Provider>
        </LocalizationProvider>
    )
}

export default Providers;