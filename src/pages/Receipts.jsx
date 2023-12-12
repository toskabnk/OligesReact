import React, { useEffect, useState } from "react";
import { Backdrop, Button, ButtonGroup, Card, CircularProgress, Grid, LinearProgress, Modal, Tooltip } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import { DataGridPremium, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, useGridApiRef } from "@mui/x-data-grid-premium"
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import oligesManagementApi from "../services/apiServices";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import SnackbarComponent from "../components/SnackbarComponent";
import { addReceipts } from "../redux/cacheSlice";
import { PDFViewer } from "@react-pdf/renderer";
import ReceiptPDF from "../components/PDFComponents/ReceiptPDFComponents/ReceiptPDF";


function Receipts() {
    const apiRef = useGridApiRef();
    let [searchParams] = useSearchParams();
    const dni = searchParams.get("dni");
    const theme = useTheme();

    const isCooperative = useSelector((state) => state.data.isCooperative)
    const access_token = useSelector((state) => state.data.access_token)
    const { receiptsCache, receiptsValid } = useSelector((state) => state.cache)
    
    const [loading, setLoading] = useState(false);
    const [isEditting, setIsEditting] = useState(false);
    const [receipts, setReceipts] = useState([]);
    const [hiddenColumns, setHiddenColumns] = useState(['actions']);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filter, setFilter] = useState(null);
    const [fieldValue, setFieldValue] = useState(null);
    const [receipt, setReceipt] = useState(null);
    const [loadDetails, setLoadDetails] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    
    const snackbarRef = React.createRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if(dni) {
            setFilter(dni)
        } else {
            setFilter(null)
        }
    }, [dni])

    useEffect(() => {
        loadReceipts()
        if(isCooperative) {
            setFieldValue('farmer_dni')
        } else {
            setFieldValue('cooperative_nif')
        }
    }, [access_token]);

    const handleLoadDetails = (row) => {
        navigate(`/receipt-details?id=${row.id}`)
    }

    const handleReceipt = (row) => {
        setLoadDetails(true);
        loadReceiptDetails(row.id);
    }

    const handleRemoveReceipt = (row) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `You are going to remove the receipt ${row.albaran_number} from ${row.farmer_name} ${row.farmer_lastname}. Farmer will be notified.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, keep it',
            confirmButtonColor: theme.palette.error.main,
            cancelButtonColor: theme.palette.success.main,
        }).then((result) => {
            if (result.isConfirmed) {
                oligesManagementApi.delete(`/receipt/${row.id}`, {bearerToken: access_token})
                .then((response) => {
                    setSeverity('success')
                    setSnackbarMessage('Receipt removed successfully')
                    setShowSnackBar(true)
                    loadReceipts()
                })
                .catch((error) => {
                    console.log(error)
                    setSeverity('error')
                    setSnackbarMessage('Error removing receipt')
                    setShowSnackBar(true)
                })
            }
        })
    }

    const loadReceiptDetails = async (id) => {
        await oligesManagementApi.get(`/receipt/${id}`, {bearerToken: access_token})
        .then((response) => {
            setReceipt(response.data.data.receipt)
            setLoadDetails(false)
            setOpenModal(true);
        })
        .catch((error) => {
            console.log(error)
            Swal.fire({
                title: 'Error!',
                text: 'Error loading receipt details',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: theme.palette.error.main,
            })
            setLoadDetails(false)
        })
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setReceipt(null);
    };

    const handleAddNew = () => {
        navigate('/receipt-register')
    }

    const handleCloseSnackbar = () => {
        setShowSnackBar(false);
    };

    const toggleColumnVisibility = (columnName) => {
        if (hiddenColumns.includes(columnName)) {
          setHiddenColumns(hiddenColumns.filter((col) => col !== columnName));
        } else {
          setHiddenColumns([...hiddenColumns, columnName]);
        }
    };

    const loadReceipts = async () => {
        setLoading(true)
        if(receiptsValid && receiptsCache.length) {
            let cacheValid = new Date(receiptsValid);
            let now = new Date();
            if(now < cacheValid){
                setReceipts(receiptsCache);
                console.log('Receipts loaded from cache');
            } else {
                console.log('Receipts cache expired');
            }
        }
        await oligesManagementApi.get('/receipt', {bearerToken: access_token})
        .then((response) => {
            console.log(response.data)

            const transformedReceipts = response.data.data.map((receipt) => ({
                id: receipt.id,
                campaign: receipt.campaign,
                albaran_number: receipt.albaran_number,
                farmer_name: receipt.farmer.name,
                farmer_lastname: receipt.farmer.surname,
                farmer_dni: receipt.farmer.dni,
                cooperative_nif: receipt.cooperative.nif,
            }))

            setReceipts(transformedReceipts)
            let actualDate = new Date();
                actualDate.setMinutes(actualDate.getMinutes() + 15);
                let date = actualDate.toISOString();
                let cacheDate = {
                    receipts: transformedReceipts,
                    date: date
                }
                dispatch(addReceipts(cacheDate))
            setLoading(false)
        })
        .catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }

    const columns = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            renderCell: (params) => (
                <>
                    <Tooltip title="Remove receipt" arrow>
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={() => handleRemoveReceipt(params.row)}>
                            <DeleteIcon/>
                        </Button>
                    </Tooltip>
                </>
            ),
        },
        {
            field: 'campaign',
            headerName: 'Campaign',
            width: 150,
        },
        {
            field: 'albaran_number',
            headerName: 'Nº Receipt',
            width: 150,
            type: 'number',
        },
        {
            field: 'farmer_name',
            headerName: 'Farmer Name',
            width: 250,
        },
        {
            field: 'farmer_lastname',
            headerName: 'Farmer Lastname',
            width: 250,
        },
        {
            field: 'farmer_dni',
            headerName: 'Farmers DNI',
            width: 180,
        },
        {
            field: 'cooperative_nif',
            headerName: 'Cooperative NIF',
            width: 180,
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
                    <Tooltip title="Receipt" arrow>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleReceipt(params.row)}>
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
            {isCooperative ? <>
                <Button startIcon={isEditting ? <EditOffIcon/> :<EditIcon />} variant="text" color="primary" onClick={() => {setIsEditting(!isEditting); toggleColumnVisibility('actions')}}>{isEditting ? 'Stop Edit' : 'Edit Receipts'}</Button>
                <Button startIcon={<AddIcon/>} variant="text" color="primary" onClick={handleAddNew}>New Receipt</Button>
            </> : null}
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
                rows={receipts}
                columns={columns.filter((col) => !hiddenColumns.includes(col.field))}
                initialState={{ pinnedColumns: { left:['actions'], right: ['details'] } }}
                autoPageSize
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: CustomNoRowsOverlay,
                    toolbar: CustomToolbar,
                }}
                loading={loading}
                filterModel={filter ? { items: [{ field: fieldValue, operator: 'contains', value: filter }] } : {items: []}}

            />
            <SnackbarComponent
            ref={snackbarRef}
            open={showSnackBar}
            message={snackbarMessage}
            severity={severity}
            handleClose={handleCloseSnackbar}/>
            <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadDetails}>
            <CircularProgress color="inherit" />
        </Backdrop>
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
                                <PDFViewer width="1000" height="600">
                                    <ReceiptPDF receipt={receipt}/>
                                </PDFViewer>
                            </Grid>
                        </Grid>
                    </Modal>
        </Card>
        
    )
}

export default Receipts