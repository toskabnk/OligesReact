import { useState } from 'react';
import {useNavigate } from "react-router-dom";
import oligesManagementApi from '../services/apiServices';
import LoadingSpinner from '../components/LoadingSpinner';
import { Box, Paper, Button, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CooperativeInfo from '../components/RegisterFormComponents/CooperativeInfo';
import AddressInfo from '../components/RegisterFormComponents/AddressInfo';
import { StyledDivSVG, StyledSVG } from '../styles/FormStyles';
import Swal from 'sweetalert2';


function FarmerRegister() { 
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    //Formik initual values, validation and submit function
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password:"",
            password2: "",
            nif: "",
            phone_number: "",
            road_type: "",
            road_name: "",
            road_number: "",
            road_letter: "",
            road_km: "",
            block: "",
            portal: "",
            stair: "",
            floor: "",
            door: "",
            town_entity: "",
            town_name: "",
            province: "",
            country: "",
            postal_code: ""
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(150, 'Must be 150 characters or less').required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(8, 'Must be 8 characters or more').required('Password is required'),
            password2: Yup.string().min(8, 'Must be 8 characters or more').oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password confirmation is required'),
            nif: Yup.string().max(9, 'Must be 9 characters or less').required('NIF is required'),
            phone_number: Yup.string().max(9, 'Must be 9 characters or less').required('Phone number is required'),
            road_type: Yup.string().max(30, 'Must be 30 characters or less').required('Road type is required'),
            road_name: Yup.string().max(150, 'Must be 150 characters or less').required('Road name is required'),
            road_number: Yup.string().max(5, 'Must be 5 characters or less').required('Road number is required'),
            road_letter: Yup.string().max(5, 'Must be 5 characters or less'),
            road_km: Yup.string().max(10, 'Must be 10 characters or less'),
            block: Yup.string().max(10, 'Must be 10 characters or less'),
            portal: Yup.string().max(10, 'Must be 10 characters or less'),
            stair: Yup.string().max(10, 'Must be 10 characters or less'),
            floor: Yup.string().max(5, 'Must be 5 characters or less'),
            door: Yup.string().max(5, 'Must be 5 characters or less'),
            town_entity: Yup.string().max(50, 'Must be 50 characters or less'),
            town_name: Yup.string().max(50, 'Must be 50 characters or less').required('Town name is required'),
            province: Yup.string().max(50, 'Must be 50 characters or less').required('Province is required'),
            country: Yup.string().max(50, 'Must be 50 characters or less').required('Country is required'),
            postal_code: Yup.string().max(5, 'Must be 5 characters or less').required('Postal code is required'),
        }),
        onSubmit: values => {
            register(values);
        },
    });


    const navigate = useNavigate();

    const register = async(values) => {
        //Set Loading to true to show spinner
        setIsLoading(true);

        //Copy values to avoid modifying the original object and add password_confirmation
        let copyValues = {
            password_confirmation: values.password2,
            ...values};
        
            //Remove password2
        delete copyValues.password2;
        
        //Remove empty values
        Object.keys(copyValues).forEach((key) => (copyValues[key] == null || copyValues[key] == "") && delete copyValues[key]);

        //Send request to API
        await oligesManagementApi.post('auth/cooperative', copyValues)
        .then(function(response) {
            console.log(response)
            if(response.data.success === true){
                setIsSuccess(true);
                Swal.fire({
                    title: 'Success!',
                    text: 'You have been registered successfully',
                    icon: 'success',
                    confirmButtonText: 'Go to Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/login');
                    }
                })
            }
        })
        .catch(function (error) {
            console.log(error)
            setIsSuccess(false)
            setIsLoading(false)
            const responseData = error.response.data;
            if (responseData.data && responseData.data.errors) {
                const validationErrors = responseData.data.errors;
                //Open sweet alert with errors
                Swal.fire({
                    title: 'Error!',
                    text: 'Please check the errors',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        //Loop through errors and set formik errors
                        Object.keys(validationErrors).forEach((key) => {
                            formik.setFieldError(key, validationErrors[key][0]);
                        });
                    }
                })
            }
        });
    }

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
                    <Typography sx={{marginTop: '20px'}} variant="h4">
                        Cooperative Registration Form
                    </Typography>
                </Box>
                <CooperativeInfo formik={formik} />
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
    ); 
} 
export default FarmerRegister; 