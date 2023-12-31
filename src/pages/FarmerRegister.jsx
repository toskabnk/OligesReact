import { useState } from 'react';
import {useNavigate } from "react-router-dom";
import oligesManagementApi from '../services/apiServices';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import RegisterForm from '../components/RegisterFormComponents/RegisterForm';


function FarmerRegister() { 
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    //Formik initual values, validation and submit function
    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            email: "",
            password:"",
            password2: "",
            dni: "",
            phone_number: "",
            movil_number: "",
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
            surname: Yup.string().max(150, 'Must be 15 characters or less').required('Surname is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(8, 'Must be 8 characters or more').required('Password is required'),
            password2: Yup.string().min(8, 'Must be 8 characters or more').oneOf([Yup.ref('password'), null], 'Passwords must match').required('Password confirmation is required'),
            dni: Yup.string().max(9, 'Must be 9 characters or less').required('DNI is required'),
            phone_number: Yup.string().max(9, 'Must be 9 characters or less'),
            movil_number: Yup.string().max(9, 'Must be 9 characters or less'),
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
        await oligesManagementApi.post('auth/farmer', copyValues)
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
        <RegisterForm 
        formik={formik} 
        isLoading={isLoading} 
        isSuccess={isSuccess} 
        title='Farmer Registration Form'/>
    ); 
} 
export default FarmerRegister; 