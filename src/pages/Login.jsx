import React, { useEffect, useState } from 'react';
import { Box, Button, Container, FormGroup, Switch, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import FormikTextField from '../components/FormikTextField';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import oligesManagementApi from '../services/apiServices';
import Swal from 'sweetalert2';
import { addUser } from '../redux/userSlice';
import { addData } from '../redux/dataSlice';
import { useDispatch, useSelector } from 'react-redux';


function Login() {
    const [checked, setChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const access_token = useSelector((state) => state.data.access_token)
    
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string().min(8, 'Must be 8 characters or more').required('Password is required'),
        }),
        onSubmit: async (values) => {
            await login(values);
        }
    })

    useEffect(() => {
        if (access_token) {
            navigate('/');
        }
    }, [access_token])

    async function login(values) {
        setIsLoading(true);

        let apiURL = checked ? 'auth/cooperative/login' : 'auth/farmer/login';

        await oligesManagementApi.post(apiURL, values)
            .then((response) => {
                console.log(response);
                setIsLoading(false);

                let token = response.data.data.access_token;
                let user = response.data.data.user;

                let detail = checked ? user.cooperative : user.farmer;

                let userData = {
                    id: detail.id,
                    name: detail.name,
                }

                let data = {
                    access_token: token,
                    isFarmer: !checked,
                    isCooperative: checked,
                }

                dispatch(addUser(userData));
                dispatch(addData(data));

                Swal.fire({
                    title: 'Success!',
                    text: 'You have been logged in successfully',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        //Loop through errors and set formik errors
                        navigate('/');
                    }
                })
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid credentials',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            })

    }
    
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
      <form onSubmit={formik.handleSubmit}>
        <Container
          component="main"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "gray.300",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 3,
              borderRadius: "5px",
              boxShadow: "2px 2px 10px gray",
              maxWidth: "sm",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Typography variant="h4" color="text.primary" align="center">
              Login
            </Typography>
            <Box sx={{ width: "100%", mt: 3 }}>
              <FormGroup>
                <FormikTextField
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  required
                  formik={formik}
                  sx={{
                    width: "100%",
                    mt: 0.5,
                    px: 1,
                    py: 1,
                    border: "1px solid gray.300",
                    borderRadius: "5px",
                  }}
                />
              </FormGroup>
              <FormGroup>
                <FormikTextField
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  required
                  formik={formik}
                  sx={{
                    width: "100%",
                    mt: 0.5,
                    px: 1,
                    py: 1,
                    border: "1px solid gray.300",
                    borderRadius: "5px",
                  }}
                />
              </FormGroup>
              <FormGroup
                sx={{
                  flexDirection: "row",
                  mt: 1,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  Farmer
                </Typography>
                <Switch
                  name="isCooperative"
                  id="isCooperative"
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  Cooperative
                </Typography>
              </FormGroup>
              <LoadingButton
                    loading={isLoading}
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Login
                  </LoadingButton> 
            </Box>
            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="text.primary">
                Don&apos;t have an account yet?{" "}
                <span
                    onClick={() => navigate('/register')}
                  style={{
                    textDecoration: "underline",
                    color: "secondary.main",
                    cursor: "pointer",
                  }}
                >
                  Register now
                </span>
              </Typography>
            </Box>
          </Box>
        </Container>
      </form>
    );
}

export default Login;