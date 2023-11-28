import { Box, Button, Paper, Typography } from "@mui/material"
import AddressInfo from "./AddressInfo"
import { StyledDivSVG, StyledSVG } from "../../styles/FormStyles"
import LoadingSpinner from "../LoadingSpinner"
import FarmInfo from "./FarmInfo"

const FarmForm = ({formik, isLoading, isSuccess}) => {
    return (
        <form onSubmit={formik.handleSubmit}>
            <Paper sx={{
                margin: 'auto',
                marginTop: '20px',
                marginBottom: '20px',
                maxWidth: '60%',
                borderRadius: '5px',
                boxShadow: '2px 2px 10px gray',
                }}>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Typography  sx={{marginTop: '20px'}} variant="h4">
                        Farm Form
                    </Typography>
                </Box>
                <FarmInfo formik={formik}/>
                <AddressInfo formik={formik} />
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

export default FarmForm