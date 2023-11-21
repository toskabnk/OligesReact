import { Box, Button, Checkbox, FormControlLabel, Paper, Typography } from "@mui/material"
import PersonalInfo from "./PersonalInfo"
import AddressInfo from "./AddressInfo"
import { StyledDivSVG, StyledSVG } from "../../styles/FormStyles"
import LoadingSpinner from "../LoadingSpinner"
import CooperativeInfo from "./CooperativeInfo"


const RegisterForm = ({formik, isLoading, isSuccess, withPassword=true, cooperative=false, title='Form', checkbox=false, width='60%'}) => {

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
                {cooperative ? <CooperativeInfo edit={withPassword} formik={formik}/> : <PersonalInfo edit={withPassword} formik={formik}/>}
                <AddressInfo formik={formik} />
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