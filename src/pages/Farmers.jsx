import { Button, ButtonGroup, Card, LinearProgress, Tooltip } from "@mui/material";
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useGridApiRef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import oligesManagementApi from "../services/apiServices";
import { useSelector } from "react-redux";
import CustomNoRowsOverlay from "../components/DataGridComponents/CustomNoRowsComponent";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from "react-router-dom";

function Farmers() {
    const apiRef = useGridApiRef();
    const [farmers, setFarmers] = useState([]);
    const access_token = useSelector((state) => state.data.access_token)
    const isCooperative = useSelector((state) => state.data.isCooperative)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const controller = new AbortController();

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
            .catch((error) => {
                console.log(error);
                setLoading(false);
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
                            variant="contained"
                            color="primary"
                            onClick={() => handleButtonClick(params.row)}>
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

    const handleButtonClick = (id) => {
    // Handle button click logic here
    console.log(id);
    };

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
        </Card>
    );
}

export default Farmers;