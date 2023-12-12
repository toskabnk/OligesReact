import { Box, Stack } from "@mui/material";
import FormikTextField from "../FormikTextField";


const PersonalInfo = ({formik, edit=false}) => {
    return (
        <Box sx={{margin: '10px',  display: 'flex', flexDirection: 'column', pt: 2 }}>
            <Stack direction="column">
                <Stack direction="row">
                    <FormikTextField margin='normal' id='name' type='text' label='Name' required fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='surname' type='text' label='Surname' required fullWidth formik={formik}/>
                </Stack>
                <FormikTextField margin='normal' id='email' type='text' label='Email' required fullWidth formik={formik}/>
                {edit ? null : 
                    <Stack direction="row">
                        <FormikTextField margin='normal' id='password' type='password' label='Password' required fullWidth formik={formik}/>
                        <FormikTextField margin='normal' id='password2' type='password' label='Repeat Password' required fullWidth formik={formik}/>
                    </Stack>
                }
            </Stack>
            <FormikTextField margin='normal' id='dni' type='text' label='DNI' required fullWidth formik={formik}/>
            <FormikTextField margin='normal' id='phone_number' type='text' label='Phone Number' fullWidth formik={formik}/>
            <FormikTextField margin='normal' id='movil_number' type='text' label='Movil Number'  fullWidth formik={formik}/>
        </Box>
    );
}

export default PersonalInfo;