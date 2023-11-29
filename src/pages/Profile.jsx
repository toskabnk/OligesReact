import { Backdrop, Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from 'yup';
import { useFormik } from "formik";
import AddressInfo from "../components/RegisterFormComponents/AddressInfo";
import PersonalInfo from "../components/RegisterFormComponents/PersonalInfo";
import CooperativeInfo from "../components/RegisterFormComponents/CooperativeInfo";
import EditCardComponent from "../components/ProfileComponents/EditCardComponent";
import { useSelector } from "react-redux";
import oligesManagementApi from "../services/apiServices";
import Swal from "sweetalert2";
import PasswordInfo from "../components/RegisterFormComponents/PasswordInfo";
import SnackbarComponent from "../components/SnackbarComponent";
import SignatureCanvas from 'react-signature-canvas'

function Profile() { 
    const [loading, setLoading] = useState(true); 
    const [openPersonal, setOpenPersonal] = useState(false); 
    const [openAddress, setOpenAddress] = useState(false);
    const [openSignature, setOpenSignature] = useState(false);
    const [error, setError] = useState(false);
    const [id, setId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [openPassword, setOpenPassword] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [isLoadingSign, setIsLoadingSign] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [signValue, setSignValue] = useState(null);
    
    const snackbarRef = React.createRef();
    const canvasRef = useRef();


    const access_token = useSelector((state) => state.data.access_token)
    const isCooperative = useSelector((state) => state.data.isCooperative)

    useEffect(() => {
        async function loadData() {
            await oligesManagementApi.get('profile', { bearerToken: access_token })
                .then((response) => {
                    console.log(response);
                    const data = response.data.data;
                    setOpenPersonal(true);
                    setLoading(false);
        
                    const type = isCooperative ? 'cooperative' : 'farmer';
                    const addressKey = type === 'cooperative' ? 'cooperative' : 'farmer';
        
                    const infoToUpdate = isCooperative ? cooperativeInfo : personalInfo;
        
                    const infoFields = {
                        name: 'name',
                        nif: 'nif',
                        phone_number: 'phone_number',
                        surname: 'surname',
                        dni: 'dni',
                        movil_number: 'movil_number',
                    };
        
                    Object.keys(infoFields).forEach((field) => {
                        if(data[type][infoFields[field]] === null) {
                            infoToUpdate.setFieldValue(field, '');
                        } else {
                            infoToUpdate.setFieldValue(field, data[type][infoFields[field]]);
                        }
                    });

                    infoToUpdate.setFieldValue('email', data.email);

                    if(type === 'cooperative') {
                        setId(data.cooperative.id);
                        if(data.cooperative.cooperative_sign) {
                            signInfo.setFieldValue('cooperative_sign', data.cooperative.cooperative_sign);
                            setSignValue(data.cooperative.cooperative_sign);
                        }
                    } else {
                        setId(data.farmer.id);
                    }
        
                    const addressFields = [
                        'road_type', 'road_name', 'road_number', 'road_letter',
                        'road_km', 'block', 'portal', 'stair', 'floor', 'door',
                        'town_entity', 'town_name', 'province', 'country', 'postal_code',
                    ];
        
                    addressFields.forEach((field) => {
                        if(data[addressKey].address[field] === null) {
                            addressInfo.setFieldValue(field, '');
                        } else {
                            addressInfo.setFieldValue(field, data[addressKey].address[field]);
                        }
                    });
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error loading profile data',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                    setLoading(false);
                    setError(true);
                })
        }

        loadData();
    }, [access_token]);

    const cooperativeInfo = useFormik({
        initialValues: {
            name: "",
            email: "",
            nif: "",
            phone_number: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(150, 'Must be 150 characters or less').required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            nif: Yup.string().max(9, 'Must be 9 characters or less').required('NIF is required'),
            phone_number: Yup.string().max(9, 'Must be 9 characters or less').required('Phone number is required'),
        }),
        onSubmit: values => {
            update(values);
        },
    });

    const personalInfo = useFormik({
        initialValues: {
            name: "",
            surname: "",
            email: "",
            dni: "",
            phone_number: "",
            movil_number: "",
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(150, 'Must be 150 characters or less').required('Name is required'),
            surname: Yup.string().max(150, 'Must be 15 characters or less').required('Surname is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            dni: Yup.string().max(9, 'Must be 9 characters or less').required('DNI is required'),
            phone_number: Yup.string().max(9, 'Must be 9 characters or less'),
            movil_number: Yup.string().max(9, 'Must be 9 characters or less'),
        }),
        onSubmit: values => {
            update(values);
        },
    });

    const addressInfo = useFormik({
        initialValues: {
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
            update(values);
        },
    });

    const passwordInfo = useFormik({
        initialValues: {
            old_password: "",
            new_password: "",
            new_password_confirmation: "",
        },
        validationSchema: Yup.object().shape({
            old_password: Yup.string().required('Old password is required').min(8, 'Must be 8 characters or more'),
            new_password: Yup.string().required('New password is required').min(8, 'Must be 8 characters or more'),
            new_password_confirmation: Yup.string().min(8, 'Must be 8 characters or more').oneOf([Yup.ref('new_password'), null], 'Passwords must match').required('Password confirmation is required'),
        }),
        onSubmit: values => {
            updatePassword(values);
        },
    });

    const signInfo = useFormik({
        initialValues: {
            cooperative_sign: '',
        },
        validationSchema: Yup.object({
            cooperative_sign: Yup.string().required('Signature is required'),
        }),
        onSubmit: values => {
            if (!canvasRef.current.isEmpty()) {
                addSignature(values)
              } else {
                console.log('Signature is empty');
                signInfo.setFieldError('cooperative_sign', 'Signature is required');
            }
            console.log(signInfo.errors);
        }
    });

    const { errors, touched } = signInfo;

    async function updatePassword(values) {
        setIsLoadingPassword(true);
        //Copy values into a clean object
        await oligesManagementApi.put('password', values, { bearerToken: access_token })
            .then((response) => {
                setIsLoadingPassword(false);
                setSeverity('success');
                setSnackbarMessage('Password updated successfully');
                setShowSnackBar(true);
                passwordInfo.resetForm();
            })
            .catch((error) => {
                console.log(error);
                setIsLoadingPassword(false);
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
                                passwordInfo.setFieldError(key, validationErrors[key][0]);
                            });
                        }
                    })
                }else {
                    if(responseData.data.message == 'Invalid credentials.') {
                        setSeverity('error');
                        setSnackbarMessage('Invalid password');
                        setShowSnackBar(true);
                        passwordInfo.setFieldError('old_password', 'Invalid password');
                    }
                }
            })
    }

    async function addSignature(values) {
        setIsLoadingSign(true);
        const url = `cooperative/signature`;
        await oligesManagementApi.post(url, values, { bearerToken: access_token })
            .then((response) => {
                setIsLoadingSign(false);
                setSeverity('success');
                setSnackbarMessage('Signature updated successfully');
                setShowSnackBar(true);
                signInfo.resetForm();
                setSignValue(values.cooperative_sign);
            })
            .catch((error) => {
                console.log(error);
                setIsLoadingSign(false);
                setSeverity('error');
                setSnackbarMessage('Error updating signature');
                setShowSnackBar(true);
            })
    }


    async function update(values) {
        setIsLoading(true);
        //Copy values into a clean object
        let valuesCopy = { ...values };

        //Delete empty fields
        Object.keys(valuesCopy).forEach((key) => {
            if(valuesCopy[key] === "") {
                delete valuesCopy[key];
            }
        });

        const type = isCooperative ? 'cooperative' : 'farmer';
        const addressKey = type === 'cooperative' ? 'cooperative' : 'farmer';
        const url = `${addressKey}/${id}`;

        await oligesManagementApi.put(url, valuesCopy, { bearerToken: access_token })
            .then((response) => {
                setIsLoading(false);
                Swal.fire({
                  title: "Success!",
                  text: "Profile updated successfully",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
            })
            .catch((error) => {
                setIsLoading(false);
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
                                personalInfo.setFieldError(key, validationErrors[key][0]);
                                cooperativeInfo.setFieldError(key, validationErrors[key][0]);
                                addressInfo.setFieldError(key, validationErrors[key][0]);
                            });
                        }
                    })
                }
            })
    }

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
    };

    return ( 
        <> 
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <h1 style={{ 
                display: "flex",  
                justifyContent: "center", 
            }}> 
                Profile
            </h1> 
            <EditCardComponent
                title='Personal Details'
                open={openPersonal}
                setOpen={setOpenPersonal}
                info={isCooperative ? cooperativeInfo : personalInfo}
                error={error}
                isLoading={isLoading}>
                {isCooperative ? <CooperativeInfo edit={true} formik={cooperativeInfo}/> : <PersonalInfo edit={true} formik={personalInfo}/>}
            </EditCardComponent>
            <EditCardComponent
                title='Address Details'
                open={openAddress}
                setOpen={setOpenAddress}
                info={addressInfo}
                error={error}
                isLoading={isLoading}>
                <AddressInfo formik={addressInfo}/>
            </EditCardComponent>
            <EditCardComponent
                title='Change Password'
                open={openPassword}
                setOpen={setOpenPassword}
                info={passwordInfo}
                error={errorPassword}
                isLoading={isLoadingPassword}>
                <PasswordInfo formik={passwordInfo}/>
            </EditCardComponent>
            {isCooperative ? 
                <EditCardComponent
                    title='Cooperative Signature'
                    open={openSignature}
                    setOpen={() => {setOpenSignature(!openSignature)}}
                    info={signInfo}
                    error={error}
                    isLoading={isLoadingSign}>
                    <Box sx={{margin: '15px',  display: 'flex', flexDirection: 'column', pb:2}}>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography  sx={{marginTop: '20px', marginLeft: '10px', color: 'red'}} variant="h7">
                                    {errors['cooperative_sign'] && touched['cooperative_sign'] ? (
                                        errors['cooperative_sign']
                                    ) : null}
                                    </Typography>
                        </Box>
                        <Box sx={{margin: '10px',  display: 'flex', flexDirection: 'column', pt: 2 }}>
                            <Stack direction="row" sx={{display:'flex', justifyContent:'center'}}>
                                {signValue ? <img src={signValue} alt="Imagen en base64"/> : <p style={{marginRight: '90px', marginTop: '80px'}}>No actual sign</p>}
                                <div style={{ border: errors['cooperative_sign'] && touched['cooperative_sign'] ? '1px solid red' : '1px solid'}}>
                                    <SignatureCanvas
                                        ref={canvasRef}
                                        onEnd={() => signInfo.setFieldValue('cooperative_sign', canvasRef.current.toDataURL())}
                                        canvasProps={{width: 320, height: 180}}/>
                                </div>
                            </Stack>
                        </Box>
                    </Box>
                </EditCardComponent>
            : null}
            <SnackbarComponent
            ref={snackbarRef}
            open={showSnackBar}
            message={snackbarMessage}
            severity={severity}
            handleClose={handleCloseSnackbar}/>
        </> 
    ); 
} 

export default Profile;