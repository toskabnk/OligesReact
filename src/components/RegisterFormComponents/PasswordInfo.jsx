import { Box, Stack } from "@mui/material";
import FormikTextField from "../FormikTextField";

const PasswordInfo = ({formik}) => {
    return (
        <Box sx={{margin: '10px',  display: 'flex', flexDirection: 'column', pt: 2 }}>
            <FormikTextField margin='normal' id='old_password' type='password' label='Old password' required fullWidth formik={formik}/>
            <Stack direction="row">
                <FormikTextField margin='normal' id='new_password' type='password' label='New password' required fullWidth formik={formik}/>
                <FormikTextField margin='normal' id='new_password_confirmation' type='password' label='Repeat new password' required fullWidth formik={formik}/>
            </Stack>
        </Box>
    );
}

export default PasswordInfo