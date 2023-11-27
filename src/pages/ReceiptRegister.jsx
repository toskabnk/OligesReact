import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import LoadingSpinner from "../components/LoadingSpinner";
import { StyledDivSVG, StyledSVG } from "../styles/FormStyles";
import { useEffect, useRef, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useSelector } from "react-redux";
import FormikTextField from "../components/FormikTextField";
import { DataGridPremium } from "@mui/x-data-grid-premium";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import SignatureCanvas from 'react-signature-canvas'

const ReceiptRegister = () => {
    const access_token = useSelector((state) => state.data.access_token)
    
    const [loadingData, setLoadingData] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [farmer, setFarmer] = useState(null);
    const [farm, setFarm] = useState([]);
    const [weights, setWeights] = useState([]);
    const [farmerValue, setFarmerValue] = useState('');
    const [farmerSelected, setFarmerSelected] = useState(null);
    const [farmerDNIValue, setFarmerDNIValue] = useState('');
    const [farmsLoading, setFarmsLoading] = useState(true);
    const [farmValue, setFarmValue] = useState('');
    const [farmSelected, setFarmSelected] = useState(null);
    const [loadingFarmersFarms, setLoadingFarmersFarms] = useState(false);
    const [albaran_number, setAlbaran_number] = useState('');
    const [campaign, setCampaign] = useState('');
    const [totalKg, setTotalKg] = useState(0);
    const [tareKg, setTareKg] = useState(0);

    const canvasRef = useRef();

    const loadFarmers = async () => {
        oligesManagementApi.get('/cooperative/farmers', {bearerToken: access_token} )
        .then(response => {
            console.log(response)
            setFarmer(response.data.data.farmer)
            setLoadingData(false)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const loadFarmersFarms = async () => {
        if(!farmerSelected){
            return
        }
        setLoadingFarmersFarms(true)
        oligesManagementApi.get(`/farm/farmer/${farmerSelected.id}`, {bearerToken: access_token} )
        .then(response => {
            console.log(response)
            setFarm(response.data.data.farm)
            setFarmsLoading(false)
            setLoadingFarmersFarms(false)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const loadLastReceipt = async () => {
        oligesManagementApi.get('/receipt/last', {bearerToken: access_token} )
        .then(response => {
            console.log(response)
            let lastAlbaran = response.data.data.receipt.albaran_number
            lastAlbaran = parseInt(lastAlbaran) + 1
            //Today date in this format YYYY-MM-DD
            const today = new Date().toISOString().slice(0, 10)
            formik.setFieldValue('date', today)
            setAlbaran_number(lastAlbaran)
            setCampaign(response.data.data.receipt.campaign)
        })
        .catch(error => {
            console.log(error)
        })
    }

    const addWeight = async (values) => {
        let copyValues = {
        ...values
        };
        
        Object.keys(copyValues).forEach((key) => (copyValues[key] == null || copyValues[key] == "") && delete copyValues[key]);

        copyValues.id = weights.length + 1

        setWeights([...weights, copyValues])

        formik.setFieldValue('weights', [...weights, copyValues])
    }

    const sendReceipt = async (values) => {
        setIsLoading(true)
        oligesManagementApi.post('/receipt', values, {bearerToken: access_token} )
        .then(response => {
            console.log(response)
            setIsSuccess(true)
        })
        .catch(error => {
            console.log(error)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        loadFarmers();
        loadLastReceipt();
    }, [])

    useEffect(() => {
        loadFarmersFarms();
    }, [farmerSelected])

    const columns = [
        {
            field: 'type',
            headerName: 'Type',
            width: 150,
        },
        {
            field: 'kilos',
            headerName: 'Kilos',
            type: 'number',
            width: 150,
        },
        {
            field: 'sampling',
            headerName: 'Sampling',
            type: 'number',
            width: 150,
        },
        {
            field: 'container',
            headerName: 'Container',
            type: 'number',
            width: 150,
        },
        {
            field: 'purple_percentage',
            headerName: 'Purple %',
            type: 'number',
            width: 150,
        },
        {
            field: 'rehu_percentage',
            headerName: 'Rehu %',
            type: 'number',
            width: 150,
        },
        {
            field: 'leaves_percentage',
            headerName: 'Leaves %',
            type: 'number',
            width: 150,
          },
    ];

    const formik = useFormik({
        initialValues: {
            date: '',
            sign: '',
            farmer_id: '',
            farm_id: '',
            weights: [],
        },
        validationSchema: Yup.object({
            farmer_id: Yup.string().required('Required'),
            farm_id: Yup.string().required('Required'),
            weights: Yup.array().min(1, 'Required'),
        }),
        onSubmit: values => {
            if (!canvasRef.current.isEmpty()) {
                sendReceipt(values)
              } else {
                console.log('Signature is empty');
              }
        },
    });

    const weightFormik = useFormik({
        initialValues: {
            id: '',
            type: '',
            kilos: '',
            sampling: '',
            container: '',
            purple_percentage: '',
            rehu_percentage: '',
            leaves_percentage: '',
        },
        validationSchema: Yup.object({
            type: Yup.string().max(10, 'Must be 10 characters or less').required('Required'),
            kilos: Yup.number().required('Required'),
            sampling: Yup.number(),
            container: Yup.number(),
            purple_percentage: Yup.number(),
            rehu_percentage: Yup.number(),
            leaves_percentage: Yup.number(),
        }),
        onSubmit: values => {
            console.log(values)
            addWeight(values)
        },
    });

    return (
        <>
            {loadingData ? 
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={loadingData}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                : 
                <Paper sx={{
                        margin: 'auto',
                        marginTop: '20px',
                        maxWidth: '90%',
                        borderRadius: '5px',
                        boxShadow: '2px 2px 10px gray',
                        }}>
                <form onSubmit={formik.handleSubmit} id='receiptForm'>
                    <Paper sx={{
                        margin: 'auto',
                        marginTop: '20px',
                        maxWidth: '95%',
                        borderRadius: '5px',
                        boxShadow: '2px 2px 10px gray',
                        }}>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Typography  sx={{marginTop: '20px'}} variant="h4">
                                New Receipt
                            </Typography>
                        </Box>
                        <Box sx={{margin: '15px',  display: 'flex', flexDirection: 'column', pt: 2, pb: 3 }}>
                        <Stack sx={{marginBottom: '15px'}} direction="row">
                                <TextField
                                    sx={{marginRight: '15px'}}
                                    id="alabaran_number"
                                    label="Albaran Number"
                                    fullWidth
                                    value={albaran_number}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    sx={{marginRight: '15px'}}
                                    id="campaign"
                                    label="Campaign"
                                    value={campaign}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <TextField
                                    id="date"
                                    label="Date"
                                    fullWidth
                                    value={formik.values.date}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Stack>
                            <Stack direction="row">
                                <Autocomplete
                                disablePortal
                                fullWidth
                                sx={{marginRight: '15px', marginBottom: '15px'}}
                                id='farmer_id'
                                options={farmer}
                                inputValue={farmerValue}
                                value={farmerSelected}
                                onChange={(event, newValue) => {
                                    setFarmsLoading(true)
                                    setFarmValue('')
                                    setFarmSelected(null)
                                    setFarmerSelected(newValue);
                                    formik.setFieldValue('farmer_id', newValue.id)
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setFarmerValue(newInputValue);
                                }}
                                getOptionLabel={(option) => {
                                    if(!option){
                                        return ''
                                    } else {
                                    return '[' + option.id + '] ' + option.name + ' ' + option.surname
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Farmer"
                                    inputProps={{
                                        ...params.inputProps
                                    }}
                                    />
                                )}/>
                                <Autocomplete
                                disablePortal
                                fullWidth
                                id='farmer_dni'
                                options={farmer}
                                inputValue={farmerDNIValue}
                                value={farmerSelected}
                                onChange={(event, newValue) => {
                                    setFarmsLoading(true)
                                    setFarmValue('')
                                    setFarmSelected(null)
                                    setFarmerSelected(newValue);
                                    formik.setFieldValue('farmer_id', newValue.id)
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setFarmerDNIValue(newInputValue);
                                }}
                                getOptionLabel={(option) => {
                                    if(!option){
                                        return ''
                                    } else {
                                    return option.dni
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    error
                                    helperText="Incorrect entry."
                                    label="Farmer DNI"
                                    inputProps={{
                                        ...params.inputProps
                                    }}
                                    />
                                )}/>
                            </Stack>
                            <Stack direction="row">
                                <Autocomplete
                                disablePortal
                                fullWidth
                                disabled={farmsLoading}
                                loading={loadingFarmersFarms}
                                id='farm_id'
                                options={farm}
                                inputValue={farmValue}
                                value={farmSelected}
                                onChange={(event, newValue) => {
                                    setFarmSelected(newValue);
                                    formik.setFieldValue('farm_id', newValue.id)
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setFarmValue(newInputValue);
                                }}
                                getOptionLabel={(option) => {
                                    if(!option){
                                        return ''
                                    } else {
                                    return '[' + option.id + '] ' + option.name
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="Farm"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                            {loadingFarmersFarms ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                    />
                                )}/>
                                {/*<Button sx={{margin: '10px', width:'10%'}} size='large' variant="contained" color="primary" type="button">New Farm</Button>*/}
                            </Stack>
                        </Box>
                    </Paper>
                </form>
                <Paper sx={{
                            margin: 'auto',
                            marginBottom: '20px',
                            maxWidth: '95%',
                            borderRadius: '5px',
                            boxShadow: '2px 2px 10px gray',
                            }}>
                    <form onSubmit={weightFormik.handleSubmit}>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Typography  sx={{marginTop: '20px'}} variant="h4">
                                Weights
                            </Typography>
                        </Box>
                        <Box sx={{margin: '15px',  display: 'flex', flexDirection: 'column', }}>
                            <Stack direction="row">
                                <FormikTextField 
                                    margin='normal'
                                    sx={{marginRight: '15px'}} 
                                    id='type' 
                                    type='text' 
                                    label='Type' 
                                    required 
                                    fullWidth 
                                    formik={weightFormik}/>
                                <TextField
                                    margin='normal' 
                                    sx={{marginRight: '15px'}}
                                    id='total_kg' 
                                    type='number' 
                                    label='Net Kilos'
                                    required
                                    value={totalKg}
                                    onChange={(event) => {
                                        setTotalKg(event.target.value);
                                        const total_kg = event.target.value
                                        const tare = tareKg
                                        const net = total_kg - tare
                                        weightFormik.setFieldValue('kilos', net)
                                    }}
                                    fullWidth />
                                <TextField
                                    margin='normal' 
                                    sx={{marginRight: '15px'}}
                                    id='tare' 
                                    type='number' 
                                    label='Tare'
                                    required
                                    fullWidth
                                    value={tareKg}
                                    onChange={(event) => {
                                        setTareKg(event.target.value);
                                        const tare = event.target.value
                                        const total_kg = totalKg
                                        const net = total_kg - tare
                                        weightFormik.setFieldValue('kilos', net)
                                    }}/>
                                <FormikTextField
                                    margin='normal' 
                                    sx={{marginRight: '15px'}}
                                    id='kilos' 
                                    type='number' 
                                    label='Total Kilos' 
                                    required 
                                    fullWidth
                                    disabled={true}
                                    formik={weightFormik}/>
                                <FormikTextField
                                    margin='normal' 
                                    id='sampling' 
                                    type='number' 
                                    label='Sampling' 
                                    fullWidth 
                                    formik={weightFormik}/>
                            </Stack>    
                            <Stack direction="row">
                                <FormikTextField 
                                    margin='normal'
                                    sx={{marginRight: '15px'}} 
                                    id='container' 
                                    type='text' 
                                    label='Container' 
                                    fullWidth 
                                    formik={weightFormik}/>
                                <FormikTextField
                                    margin='normal' 
                                    sx={{marginRight: '15px'}}
                                    id='purple_percentage' 
                                    type='number' 
                                    label='Purple %' 
                                    fullWidth 
                                    formik={weightFormik}/>
                                <FormikTextField
                                    margin='normal' 
                                    sx={{marginRight: '15px'}}
                                    id='rehu_percentage' 
                                    type='number' 
                                    label='Rehu %' 
                                    fullWidth 
                                    formik={weightFormik}/>
                                <FormikTextField
                                    margin='normal' 
                                    id='leaves_percentage' 
                                    type='number' 
                                    label='Leaves %' 
                                    fullWidth 
                                    formik={weightFormik}/>
                            </Stack>    
                        </Box>
                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Button fullWidth sx={{ margin: '10px' }} variant="contained" color="primary" type="submit">Add weight</Button>
                        </Box>
                        <Box sx={{margin: '15px',  display: 'flex', flexDirection: 'column', pb:2}}>
                            <DataGridPremium
                            rows={weights}
                            columns={columns}
                            autoHeight
                            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                            sx={{ '--DataGrid-overlayHeight': '300px' }}/>
                        </Box>
                        <Box sx={{margin: '15px',  display: 'flex', flexDirection: 'column', pb:2}}>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <Typography  sx={{marginTop: '20px'}} variant="h4">
                                    Sign
                                </Typography>
                            </Box>
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                <div style={{ border: '1px solid #000'}}>
                                <SignatureCanvas
                                    ref={canvasRef}
                                    onEnd={() => formik.setFieldValue('sign', canvasRef.current.toDataURL())}
                                    canvasProps={{width: 320, height: 180}}/>
                                </div>
                            </Box>
                        </Box>
                    </form>
                </Paper>
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
                        :   <LoadingSpinner />)
                    :   <Button sx={{ margin: '10px', width:'95%' }} variant="contained" color="primary" form='receiptForm' type="submit">Register receipt</Button>}
                </Box>
            </Paper>
            }
        </>
    )
}

export default ReceiptRegister