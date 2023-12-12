import { Backdrop, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogContent, Grid, LinearProgress, Modal, Tooltip } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";
import { InfoTypography, StyledPaper } from "../styles/ModalStyles";
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import SnackbarComponent from "../components/SnackbarComponent";
import AddIcon from '@mui/icons-material/Add';
import FarmForm from "../components/RegisterFormComponents/FarmForm";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Swal from "sweetalert2";
import { addFarms } from "../redux/cacheSlice";

function Farms() {
    const apiRef = useGridApiRef();
    const theme = useTheme();
    const id = useSelector((state) => state.user.id)
    const isFarmer = useSelector((state) => state.data.isFarmer)
    const access_token = useSelector((state) => state.data.access_token)
    const { farmsCache, farmsValid } = useSelector((state) => state.cache);
    
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [farm, setFarm] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loadDetails, setLoadDetails] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const snackbarRef = React.createRef();
    
    const controller = new AbortController();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleLoadDetails = (row) => {
        setLoadDetails(true);
        loadModalContent(row.id);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
        setFarm(null);
    };

    const handleButtonClick = (id) => {
        // Handle button click logic here
        console.log(id);
    };

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
    };

    const handleAddNew = () => {
        setIsAdding(true);
    };

    const handleCloseDialog = () => {
        setIsAdding(false);
        setIsSuccess(false);
    }

    const loadFarms = async () => {
        setLoading(true);
        if(farmsValid && farmsCache.length) {
            let cacheValid = new Date(farmsValid);
            let now = new Date();
            if(now < cacheValid){
                setFarms(farmsCache);
                console.log('Farms loaded from cache');
            } else {
                console.log('Farms cache expired');
            }
        }
        await oligesManagementApi.get(`/farm/farmer/${id}`, { bearerToken: access_token, signal: controller.signal })
            .then((response) => {
                console.log(response.data);
                
                const transformedData = response.data.data.farm.map((farm) => ({
                    id: farm.id,
                    name: farm.name,
                    polygon: farm.polygon,
                    plot: farm.plot,
                    address: farm.address,
                }));
                setFarms(transformedData);
                let actualDate = new Date();
                actualDate.setMinutes(actualDate.getMinutes() + 15);
                let date = actualDate.toISOString();
                let cacheDate = {
                    farms: transformedData,
                    date: date
                }
                dispatch(addFarms(cacheDate))
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setSnackbarMessage('Something went wrong, try again later');
                setSeverity('error');
                setShowSnackBar(true);
            })
    }

    const postData = async (values) => {
        setIsLoading(true);
        await oligesManagementApi.post(`/farm/${id}`, values, { bearerToken: access_token })
            .then((response) => {
                console.log(response.data);
                setIsLoading(false);
                setIsSuccess(true);
                formik.resetForm();
                setSnackbarMessage('Farm created successfully');
                setSeverity('success');
                setShowSnackBar(true);
                loadFarms();
                setIsAdding(false);
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
                        confirmButtonText: 'Ok',
                        confirmButtonColor: theme.palette.error.main,
                        target: document.getElementById('dialog')
                    }).then((result) => {
                        if (result.isConfirmed) {
                            //Loop through errors and set formik errors
                            Object.keys(validationErrors).forEach((key) => {
                                formik.setFieldError(key, validationErrors[key][0]);
                            });
                        }
                    })
                }
            })
    }

    function loadModalContent(id) {
        oligesManagementApi.get(`farm/${id}`, { bearerToken: access_token })
            .then((response) => {
                setFarm(response.data.data.farm);
                setOpenModal(true);
                setLoadDetails(false);
            })
            .catch(() => {
                setLoadDetails(false);
                setSnackbarMessage('Something went wrong, try again later');
                setSeverity('error');
                setShowSnackBar(true);
            })
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            polygon: '',
            plot: '',
            road_type: '',
            road_name: '',
            road_number: '',
            road_letter: '',
            road_km: '',
            block: '',
            portal: '',
            stair: '',
            floor: '',
            door: '',
            town_entity: '',
            town_name: '',
            province: '',
            country: '',
            postal_code: '',
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().required('Required').max(150, 'Must be 150 characters or less'),
            polygon: Yup.string().required('Required').max(10, 'Must be 10 characters or less'),
            plot: Yup.string().required('Required').max(10, 'Must be 10 characters or less'),
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
        onSubmit: (values) => {
            postData(values);
        },
    });

    const ModalContent = () => (
        <StyledPaper>
            <InfoTypography variant="h6">ID: {farm?.id}</InfoTypography>
            <InfoTypography>Name: {farm?.name}</InfoTypography>
            <InfoTypography>Polygon: {farm?.polygon}</InfoTypography>
            <InfoTypography>Plot: {farm?.plot}</InfoTypography>

            <InfoTypography>
                Address: {farm?.address.road_type} {farm?.address.road_name} {farm?.address.road_number} 
                        {farm?.address.road_letter} {farm?.address.road_km} {farm?.address.block} 
                        {farm?.address.portal} {farm?.address.stair} {farm?.address.floor} 
                        {farm?.address.door} {farm?.address.town_entity} {farm?.address.town_name} 
                        {farm?.address.province} {farm?.address.country} {farm?.address.postal_code}
            </InfoTypography>
        </StyledPaper>
    );

    //Load farmers from API
    useEffect(() => {
        loadFarms()
    }, [access_token]);

    useEffect(() => {
        if (!isFarmer) {
            controller.abort()
            navigate('/');
        }
    }, [isFarmer]);

    const columns = [
        {
            field: 'name',
            headerName: 'Farm Name',
            width: 300,
        },
        {
            field: 'polygon',
            headerName: 'Polygon',
            width: 200,
        },
        {
            field: 'plot',
            headerName: 'Plot',
            width: 200,
        },
        {
            field: 'details',
            headerName: 'Details',
            width: 150,
            renderCell: (params) => (
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Tooltip title="Details" arrow>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleLoadDetails(params.row)}>
                            <VisibilityIcon/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Receipts" arrow>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleButtonClick(params.row)}>
                            <ReceiptLongIcon/>
                        </Button>
                    </Tooltip>
                </ButtonGroup>
                
            ),
        },
    ];

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <Button startIcon={<AddIcon/>} variant="text" color="primary" onClick={handleAddNew}>New Farm</Button>
          </GridToolbarContainer>
        );
    }

    return (
        <Card sx={{ 
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            minWidth: 300, 
            width: '95%',
            border: "1px solid rgba(211,211,211,0.6)",
            height: "90vh",
        }}>
            <DataGridPremium
                apiRef={apiRef}
                rows={farms}
                columns={columns}
                initialState={{ pinnedColumns: { right: ['details'] } }}
                autoPageSize
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: CustomNoRowsOverlay,
                    toolbar: CustomToolbar,
                }}
                loading={loading}
            />
        <Modal open={openModal} onClose={handleCloseModal}>
            <Grid
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                }}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                >
                <Grid item xs={3}>
                    <ModalContent/>
                </Grid>      
            </Grid>
        </Modal>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadDetails}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <SnackbarComponent
            ref={snackbarRef}
            open={showSnackBar}
            message={snackbarMessage}
            severity={severity}
            handleClose={handleCloseSnackbar}/>
        <Dialog 
            id="dialog"
            maxWidth="xl"
            onClose={handleCloseDialog}
            open={isAdding}>
                <DialogContent>
                    <FarmForm
                    formik={formik}
                    isLoading={isLoading}
                    isSuccess={isSuccess}/>
                </DialogContent>
        </Dialog>
        </Card>
    );
}

export default Farms;