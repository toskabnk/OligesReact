import { Box, Button, Checkbox, FormControlLabel, Paper, Typography } from "@mui/material"
import PersonalInfo from "./PersonalInfo"
import AddressInfo from "./AddressInfo"
import { StyledDivSVG, StyledSVG } from "../../styles/FormStyles"
import LoadingSpinner from "../LoadingSpinner"
import CooperativeInfo from "./CooperativeInfo"
import ExistingFarmerInfo from "./ExistingFarmerInfo"

const RenderForm = ({formik, withPassword, cooperative, existingFarmer}) => {
    if (existingFarmer) {
        return <ExistingFarmerInfo formik={formik}/>
    } else {
        if (cooperative) {
            return (
            <>
                <CooperativeInfo edit={withPassword} formik={formik}/>
                <AddressInfo formik={formik} />
            </>)
        } else {
            return (
            <>
                <PersonalInfo edit={withPassword} formik={formik}/>
                <AddressInfo formik={formik} />
            </>)
        }
    }
}

const RegisterForm = ({formik, isLoading, isSuccess, withPassword=false, cooperative=false, title='Form', checkbox=false, width='60%', existingFarmer=false}) => {

    return (
        <form onSubmit={formik.handleSubmit}>
            <Paper sx={{
                margin: 'auto',
                marginTop: '20px',
                marginBottom: '20px',
                maxWidth: {width},
                borderRadius: '5px',
                boxShadow: '2px 2px 10px gray',
                }}>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography  sx={{marginTop: '20px'}} variant="h4">
                        {title}
                    </Typography>
                </Box>
                <RenderForm formik={formik} withPassword={withPassword} cooperative={cooperative} existingFarmer={existingFarmer}/>
                {checkbox ? <FormControlLabel sx={{margin: 'auto'}} name='partner' onChange={formik.handleChange} control={<Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}/>} label="Partner" /> : null}
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    {isLoading ? 
                        (isSuccess ? 
                            <StyledDivSVG>
                                <StyledSVG
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24">
                                    <path d="M9 16.17l-4.24-4.24-1.41 1.41 5.66 5.66 12-12-1.41-1.41z" />
                                </StyledSVG>
                            </StyledDivSVG>
                            : <LoadingSpinner />) 
                        : <Button fullWidth sx={{ margin: '10px' }} variant="contained" color="primary" type="submit">Submit</Button>}
                </Box>
            </Paper>
        </form>
    )
}

export default RegisterForm