import { Box, Stack } from "@mui/material";
import FormikTextField from "../FormikTextField";

const FarmInfo = ({formik}) => {
    return (
        <Box sx={{margin: '10px',  display: 'flex', flexDirection: 'column', pt: 2 }}>
            <FormikTextField margin='normal' id='name' type='text' label='Farm Name' required fullWidth formik={formik}/>
            <Stack direction="row">
                <FormikTextField margin='normal' id='polygon' type='text' label='Polygon' required fullWidth formik={formik}/>
                <FormikTextField margin='normal' id='plot' type='text' label='Plot' required fullWidth formik={formik}/>
            </Stack>
        </Box>
    );
}

export default FarmInfo