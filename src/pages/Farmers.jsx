import { Backdrop, Button, ButtonGroup, Card, CircularProgress, Grid, LinearProgress, Modal, Tooltip } from "@mui/material";
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useSelector } from "react-redux";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { InfoTypography, StyledPaper } from "../styles/ModalStyles";

function Farmers() {
    const apiRef = useGridApiRef();
    const isCooperative = useSelector((state) => state.data.isCooperative)
    const access_token = useSelector((state) => state.data.access_token)
    
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [farmer, setFarmer] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loadDetails, setLoadDetails] = useState(false);
    
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
        oligesManagementApi.get('cooperative/farmers', { bearerToken: access_token, signal: controller.signal })
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
    }, [access_token]);

    useEffect(() => {
        if (!isCooperative) {
            controller.abort()
            navigate('/');
        }
    }, [isCooperative]);


    const columns = [
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
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Tooltip title="Details" arrow>
                        <Button
                            loading={loadDetails}
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
                columns={columns}
                initialState={{ pinnedColumns: { right: ['actions'] } }}
                autoPageSize
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: CustomNoRowsOverlay,
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
        </Card>

    );
}

export default Farmers;