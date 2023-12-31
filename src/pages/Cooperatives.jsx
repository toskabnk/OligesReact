import { Backdrop, Button, ButtonGroup, Card, CircularProgress, Grid, LinearProgress, Modal, Tooltip } from "@mui/material";
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useDispatch, useSelector } from "react-redux";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import SnackbarComponent from "../components/SnackbarComponent";
import { addCooperatives } from "../redux/cacheSlice";
import CooperativeModal from "../components/CooperativeModal";

function Cooperatives() {
    const apiRef = useGridApiRef();
    const isFarmer = useSelector((state) => state.data.isFarmer)
    const access_token = useSelector((state) => state.data.access_token)
    const { cooperativesCache, cooperativesValid } = useSelector((state) => state.cache);
    
    const [cooperatives, setCooperatives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cooperative, setCooperative] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loadDetails, setLoadDetails] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
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
        setCooperative(null);
    };

    const handleViewReceiptsCooperative = (row) => {
        navigate(`/receipts?dni=${row.nif}`)
    };

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
    };

    const loadCooperatives = async () => {
        setLoading(true);
        if(cooperativesValid && cooperativesCache.length) {
            let cacheValid = new Date(cooperativesValid);
            let now = new Date();
            if(now < cacheValid){
                setCooperatives(cooperativesCache);
                console.log('Cooperatives loaded from cache');
            } else {
                console.log('Cooperatives cache expired');
            }
        }
        await oligesManagementApi.get('farmer/cooperatives', { bearerToken: access_token, signal: controller.signal })
            .then((response) => {
                console.log(response.data);
                
                const transformedData = response.data.data.cooperatives.map((cooperative) => ({
                    id: cooperative.id,
                    nif: cooperative.nif,
                    name: cooperative.name,
                    phone_number: cooperative.phone_number,
                    user_id: cooperative.user_id,
                    address_id: cooperative.address_id,
                    email: cooperative.user.email,
                    partner: cooperative.pivot.partner === 1 ? 'Yes' : 'No',
                    active: cooperative.pivot.active === 1 ? 'Yes' : 'No',
                }));
                setCooperatives(transformedData);
                let actualDate = new Date();
                actualDate.setMinutes(actualDate.getMinutes() + 15);
                let date = actualDate.toISOString();
                let cacheDate = {
                    cooperatives: transformedData,
                    date: date
                }
                dispatch(addCooperatives(cacheDate))
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                setSnackbarMessage('Something went wrong, try again later');
                setSeverity('error');
                setShowSnackBar(true);
            })
    }

    function loadModalContent(id) {
        oligesManagementApi.get(`cooperative/${id}`, { bearerToken: access_token })
            .then((response) => {
                setCooperative(response.data.data.cooperative);
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

    //Load farmers from API
    useEffect(() => {
        loadCooperatives()
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
            headerName: 'Cooperative Name',
            width: 300,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 300,
        },
        {
            field: 'nif',
            headerName: 'Cooperative NIF',
            width: 200,
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
                            onClick={() => handleViewReceiptsCooperative(params.row)}>
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
                rows={cooperatives}
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
                    <CooperativeModal cooperative={cooperative}/>
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
        </Card>
    );
}

export default Cooperatives;