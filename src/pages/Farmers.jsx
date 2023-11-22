import { Backdrop, Button, ButtonGroup, Card, CircularProgress, Dialog, DialogContent, Grid, LinearProgress, Modal, Tooltip } from "@mui/material";
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useSelector } from "react-redux";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { InfoTypography, StyledPaper } from "../styles/ModalStyles";
import AddIcon from '@mui/icons-material/Add';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import RegisterForm from "../components/RegisterFormComponents/RegisterForm";
import * as Yup from 'yup';
import { useFormik } from "formik";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SnackbarComponent from "../components/SnackbarComponent";

function Farmers() {
    const apiRef = useGridApiRef();
    const isCooperative = useSelector((state) => state.data.isCooperative)
    const access_token = useSelector((state) => state.data.access_token)
    
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [farmer, setFarmer] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loadDetails, setLoadDetails] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [isEditting, setIsEditting] = useState(false);
    const [hiddenColumns, setHiddenColumns] = useState(['actions']);
    const [severity, setSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const snackbarRef = React.createRef();
    
    const controller = new AbortController();
    const navigate = useNavigate();
    
    const handleLoadDetails = (row) => {
        setLoadDetails(true);
        loadModalContent(row.id);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
        setFarmer(null);
    };

    const handleButtonClick = (id) => {
        // Handle button click logic here
        console.log(id);
    };

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
    };

    const handleRemoveFarmer = (row) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will remove the farmer from the cooperative!",
            icon: 'warning',
            confirmButtonText: 'Yes, remove it!',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                oligesManagementApi.delete(`cooperative/farmer/${row.id}`, { bearerToken: access_token })
                    .then((response) => {
                        console.log(response);
                        loadFarmers();
                        setSeverity('success');
                        setSnackbarMessage('Farmer removed!');
                        setShowSnackBar(true);
                        //setShowRemovedSnackBar(true);
                    })
                    .catch((error) => {
                        console.log(error.response);
                        setSeverity('error');
                        setSnackbarMessage('Something went wrong! Please try again later.');
                        setShowSnackBar(true);
                        //setShowErrorSnackBar(true)
                    })
            }
        })
    }

    const toggleColumnVisibility = (columnName) => {
        if (hiddenColumns.includes(columnName)) {
          setHiddenColumns(hiddenColumns.filter((col) => col !== columnName));
        } else {
          setHiddenColumns([...hiddenColumns, columnName]);
        }
    };

    const loadFarmers = async () => {
        setLoading(true);
        await oligesManagementApi.get('cooperative/farmers', { bearerToken: access_token, signal: controller.signal })
            .then((response) => {
                console.log(response.data);
                
                const transformedData = response.data.data.farmer.map((farmer) => ({
                    id: farmer.id,
                    dni: farmer.dni,
                    name: farmer.name,
                    surname: farmer.surname,
                    phone_number: farmer.phone_number,
                    movil_number: farmer.movil_number,
                    user_id: farmer.user_id,
                    address_id: farmer.address_id,
                    email: farmer.user.email,
                    partner: farmer.pivot.partner === 1 ? 'Yes' : 'No',
                    active: farmer.pivot.active === 1 ? 'Yes' : 'No',
                }));
                setFarmers(transformedData);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            })
    }

    const register = async (values) => {
        setIsLoading(true);

        let copyValues = {
            active: true,
            ...values};
        
        //Remove empty values
        Object.keys(copyValues).forEach((key) => (copyValues[key] == null || copyValues[key] == "") && delete copyValues[key]);

        if (!Object.prototype.hasOwnProperty.call(copyValues, 'partner')) {
            copyValues.partner = false;
        }
        await oligesManagementApi.post('farmer', copyValues, { bearerToken: access_token })
            .then((response) => {
                console.log(response);
                setIsLoading(false);
                setIsSuccess(true);
                setSeverity('success');
                setSnackbarMessage('Farmer registered!');
                setShowSnackBar(true);
                formik.resetForm();
                setIsAdding(false);
                loadFarmers();
            })
            .catch((error) => {
                console.log(error.response);
                setIsLoading(false);
                setIsSuccess(false);
                const responseData = error.response.data;
                if (responseData.data && responseData.data.errors) {
                    const validationErrors = responseData.data.errors;
                    //Open sweet alert with errors
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please check the errors',
                        icon: 'error',
                        confirmButtonText: 'Ok',
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
        oligesManagementApi.get(`farmer/${id}`, { bearerToken: access_token })
            .then((response) => {
                setFarmer(response.data.data.farmer);
                setOpenModal(true);
                setLoadDetails(false);
            })
            .catch(() => {
                setLoadDetails(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            })
    }

    const ModalContent = () => (
        <StyledPaper>
            <InfoTypography variant="h6">ID: {farmer?.id}</InfoTypography>
            <InfoTypography>Name: {farmer?.name}</InfoTypography>
            <InfoTypography>Email: {farmer?.user?.email}</InfoTypography>
            <InfoTypography>Phone number: {farmer?.phone_number}</InfoTypography>
            <InfoTypography>Mobile number: {farmer?.mobile_number}</InfoTypography>

            <InfoTypography>
                Address: {farmer?.address.road_type} {farmer?.address.road_name} {farmer?.address.road_number} 
                        {farmer?.address.road_letter} {farmer?.address.road_km} {farmer?.address.block} 
                        {farmer?.address.portal} {farmer?.address.stair} {farmer?.address.floor} 
                        {farmer?.address.door} {farmer?.address.town_entity} {farmer?.address.town_name} 
                        {farmer?.address.province} {farmer?.address.country} {farmer?.address.postal_code}
            </InfoTypography>
        </StyledPaper>
    );

    //Load farmers from API
    useEffect(() => {
        loadFarmers()
    }, [access_token]);

    useEffect(() => {
        if (!isCooperative) {
            controller.abort()
            navigate('/');
        }
    }, [isCooperative]);

    const formik = useFormik({
        initialValues: {
            name: "",
            surname: "",
            email: "",
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
            postal_code: "",
            partner: false,
        },
        validationSchema: Yup.object().shape({
            name: Yup.string().max(150, 'Must be 150 characters or less').required('Name is required'),
            surname: Yup.string().max(150, 'Must be 15 characters or less').required('Surname is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
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
            register(values)
        },
    });

    const columns = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <Tooltip title="Remove farmer" arrow>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleRemoveFarmer(params.row)}>
                            <PersonRemoveIcon/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="Toggle partner" arrow>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleTogglePartner(params.row)}>
                            <EditIcon/>
                        </Button>
                    </Tooltip>
                </>
            ),
        },
        {
            field: 'name',
            headerName: 'First name',
            width: 150,
        },
        {
            field: 'surname',
            headerName: 'Last name',
            width: 150,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 400,
        },
        {
            field: 'partner',
            headerName: 'Partner',
            width: 150,
        },
        {
            field: 'active',
            headerName: 'Active',
            width: 150,
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
            <Button startIcon={isEditting ? <EditOffIcon/> :<EditIcon />} variant="text" color="primary" onClick={() => {setIsEditting(!isEditting); toggleColumnVisibility('actions')}}>{isEditting ? 'Stop Edit' : 'Edit Farmers'}</Button>
            <Button startIcon={<AddIcon/>} variant="text" color="primary" onClick={() => setIsAdding(true)}>New Farmer</Button>
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
                rows={farmers}
                columns={columns.filter((col) => !hiddenColumns.includes(col.field))}
                initialState={{ pinnedColumns: { left:['actions'], right: ['details'] } }}
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
        <Dialog 
            id="dialog"
            maxWidth="xl"
            onClose={() => setIsAdding(false)}
            open={isAdding}>
                <DialogContent>
                    <RegisterForm
                        title="New Farmer"
                        withPassword={true}
                        cooperative={false}
                        isLoading={isLoading}
                        isSuccess={isSuccess}
                        formik={formik}
                        checkbox={true}
                        width="100%"
                    />
                </DialogContent>
        </Dialog>
        <SnackbarComponent
            ref={snackbarRef}
            open={showSnackBar}
            message={snackbarMessage}
            severity={severity}
            handleClose={handleCloseSnackbar}/>
        </Card>
    );
}

export default Farmers;