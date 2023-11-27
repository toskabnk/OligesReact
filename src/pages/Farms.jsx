import { Backdrop, Button, ButtonGroup, Card, CircularProgress, Grid, LinearProgress, Modal, Tooltip } from "@mui/material";
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useGridApiRef } from '@mui/x-data-grid';
import React, { useEffect, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useSelector } from "react-redux";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";
import { InfoTypography, StyledPaper } from "../styles/ModalStyles";
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarExport, GridToolbarDensitySelector } from '@mui/x-data-grid';
import SnackbarComponent from "../components/SnackbarComponent";

function Farms() {
    const apiRef = useGridApiRef();
    const id = useSelector((state) => state.user.id)
    const isFarmer = useSelector((state) => state.data.isFarmer)
    const access_token = useSelector((state) => state.data.access_token)
    
    const [farms, setFarms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [farm, setFarm] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loadDetails, setLoadDetails] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
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
        setFarm(null);
    };

    const handleButtonClick = (id) => {
        // Handle button click logic here
        console.log(id);
    };

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
    };

    const loadFarms = async () => {
        setLoading(true);
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
        </Card>
    );
}

export default Farms;