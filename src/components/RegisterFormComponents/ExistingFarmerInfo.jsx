import { Box } from "@mui/material";
import FormikTextField from "../FormikTextField";


const ExistingFarmerInfo = ({formik}) => {
    return (
        <Box sx={{margin: '10px',  display: 'flex', flexDirection: 'column', pt: 2 }}>
            <FormikTextField margin='normal' id='email' type='text' label='Email' required fullWidth formik={formik}/>
            <FormikTextField margin='normal' id='dni' type='text' label='DNI' required fullWidth formik={formik}/>
        </Box>
    );
}

export default ExistingFarmerInfo;