import { Box, Stack } from "@mui/material";
import FormikTextField from "../FormikTextField";

const AddressInfo = ({formik}) => {
    return (
        <Box sx={{margin: '10px',  display: 'flex', flexDirection: 'column', pt: 2 }}>
            <Stack direction="column">
                <Stack direction="row">
                    <FormikTextField margin='normal' id='road_type' type='text' label='Road Type' required  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='road_name' type='text' label='Road Name' required  fullWidth formik={formik}/>
                </Stack>
                <Stack direction="row">
                    <FormikTextField margin='normal' id='road_number' type='text' label='Number' required fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='road_letter' type='text' label='Road Letter'  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='road_km' type='text' label='Road KM'  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='block' type='text' label='Block'  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='portal' type='text' label='Portal'  fullWidth formik={formik}/>
                </Stack>
                <Stack direction="row">
                    <FormikTextField margin='normal' id='stair' type='text' label='Stair'  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='floor' type='text' label='Floor'  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='door' type='text' label='Door' fullWidth formik={formik}/> 
                </Stack>
                <Stack direction="row">
                    <FormikTextField margin='normal' id='town_entity' type='text' label='Town Entity'  fullWidth formik={formik}/>
                    <FormikTextField margin='normal' id='town_name' type='text' label='Town Name' required fullWidth formik={formik}/>
                </Stack>
            </Stack>
            <FormikTextField margin='normal' id='province' type='text' label='Province' required fullWidth formik={formik}/>
            <FormikTextField margin='normal' id='country' type='text' label='Country ' required fullWidth formik={formik}/>
            <FormikTextField margin='normal' id='postal_code' type='text' label='Postal Code ' required formik={formik}/>
        </Box>
    )
}

export default AddressInfo;