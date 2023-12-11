import { useEffect, useState } from "react";
import { Alert, AlertTitle, Box, CircularProgress, Paper, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import oligesManagementApi from "../services/apiServices";
import { StyledTableCell, StyledTableCellGrey } from "../styles/TableStyles";

const ReceiptDetails = ({width='80%'}) => {
    let [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const stateData = useSelector((state) => state.data)

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [errorTitle, setErrorTitle] = useState('Error');
    const [receipt, setReceipt] = useState({});

    useEffect(() => {
        loadReceiptDetails()
    }, [stateData.access_token]);

    const loadReceiptDetails = async () => {
        await oligesManagementApi.get(`/receipt/${id}`, {bearerToken: stateData.access_token})
        .then((response) => {
            setReceipt(response.data.data.receipt)
            setLoading(false)
        })
        .catch((error) => {
            console.log(error)
            setErrorText(error.response.data.data.message)
            setErrorTitle(error.response.data.data.status)
            setError(true)
            setLoading(false)
        })
    }

    return (
        <Paper sx={{
        margin: 'auto',
        marginTop: '20px',
        marginBottom: '20px',
        maxWidth: {width},
        borderRadius: '5px',
        boxShadow: '2px 2px 10px gray',
        }}>
            {error ? 
                <Alert 
                sx={{margin: 'auto', marginTop: '20px', marginBottom: '20px', width: '90%'}}
                severity="error">
                    <AlertTitle>{errorTitle}</AlertTitle>
                    {errorText}
                </Alert>
             : 
                <Box sx={{display: 'flex', flexDirection:'column' }}>
                    <Box sx={{display: 'flex', justifyContent:'center'}}>
                        <Typography  sx={{marginTop: '20px', marginBottom: '10px'}} variant="h4">
                        Receipt details
                        </Typography>
                    </Box>
                    <Box sx={{display: 'flex', justifyContent:'center'}}>
                    {loading ? (<CircularProgress sx={{margin: 'auto', marginTop: '20px', marginBottom: '20px'}}/>) : (
                        <>
                            <TableContainer sx={{marginLeft:'10px', marginRight:'10px'}} component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCellGrey align="center" colSpan={2}><strong>Date</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={2}><strong>Albaran Nº</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={2}><strong>Name</strong></StyledTableCellGrey>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <StyledTableCell align="left" colSpan={2}>{receipt.date}</StyledTableCell>
                                            <StyledTableCell align="left" colSpan={2}>{receipt.albaran_number}</StyledTableCell>
                                            <StyledTableCell align="left" colSpan={2}>{receipt.farmer.name} {receipt.farmer.surname}</StyledTableCell>
                                        </TableRow>
                                        {stateData.isFarmer ? 
                                        <>
                                            <TableRow>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>NIF</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>Cooperative Name</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={2}><strong>Address</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>Town name</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>Province</strong></StyledTableCellGrey>
                                            </TableRow>

                                            <TableRow>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.cooperative.nif}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.cooperative.name}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={2}>{receipt.cooperative.address.road_type} {receipt.cooperative.address.road_name} {receipt.cooperative.address.road_number} {receipt.cooperative.address.road_letter} {receipt.cooperative.address.road_km} {receipt.cooperative.address.block} {receipt.cooperative.address.portal} {receipt.cooperative.address.stair} {receipt.cooperative.address.floor} {receipt.cooperative.address.door}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.cooperative.address.town_name}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.cooperative.address.province}</StyledTableCell>
                                            </TableRow>
                                        </> : 
                                        <>
                                            <TableRow>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>DNI</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={3}><strong>Address</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>Town Name</strong></StyledTableCellGrey>
                                                <StyledTableCellGrey align="center" colSpan={1}><strong>Province</strong></StyledTableCellGrey>
                                            </TableRow>
                                            <TableRow>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.farmer.dni}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={3}>{receipt.farmer.address.road_type} {receipt.farmer.address.road_name} {receipt.farmer.address.road_number} {receipt.farmer.address.road_letter} {receipt.farmer.address.road_km} {receipt.farmer.address.block} {receipt.farmer.address.portal} {receipt.farmer.address.stair} {receipt.farmer.address.floor} {receipt.farmer.address.door}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.farmer.address.town_name}</StyledTableCell>
                                                <StyledTableCell align="left" colSpan={1}>{receipt.farmer.address.province}</StyledTableCell>
                                            </TableRow>
                                        </>}
                                        <TableRow>
                                            <StyledTableCellGrey align="center" colSpan={6}><strong>Origin Field</strong></StyledTableCellGrey>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCellGrey align="center" colSpan={2}><strong>Name</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Plot</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Polygon</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={2}><strong>Town Name</strong></StyledTableCellGrey>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCell align="left" colSpan={2}>{receipt.farm.name}</StyledTableCell>
                                            <StyledTableCell align="left" colSpan={1}>{receipt.farm.plot}</StyledTableCell>
                                            <StyledTableCell align="left" colSpan={1}>{receipt.farm.polygon}</StyledTableCell>
                                            <StyledTableCell align="left" colSpan={2}>{receipt.farm.address.town_name}</StyledTableCell>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCellGrey align="center" colSpan={6}><strong>Olives</strong></StyledTableCellGrey>
                                        </TableRow>
                                        <TableRow>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Variety</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Leaves %</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Purple %</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Rehu %</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Size/Sample</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={1}><strong>Kilos</strong></StyledTableCellGrey>
                                        </TableRow>
                                        {receipt.weights?.map((row) => (
                                            <TableRow key={row.desc}>
                                                <StyledTableCell align="right" colSpan={1}>{row.type}</StyledTableCell>
                                                <StyledTableCell align="right" colSpan={1}>{row.leaves}</StyledTableCell>
                                                <StyledTableCell align="right" colSpan={1}>{row.purple}</StyledTableCell>
                                                <StyledTableCell align="right" colSpan={1}>{row.rehu}</StyledTableCell>
                                                <StyledTableCell align="right" colSpan={1}>{row.sampling}</StyledTableCell>
                                                <StyledTableCell align="right" colSpan={1}>{row.kilos}</StyledTableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <StyledTableCellGrey align="center" colSpan={3}><strong>Cooperative Sign</strong></StyledTableCellGrey>
                                            <StyledTableCellGrey align="center" colSpan={3}><strong>Farmer Sign</strong></StyledTableCellGrey>
                                        </TableRow>
                                        <TableRow>
                                            {receipt.cooperative.cooperative_sign ? 
                                                <StyledTableCell align="center" colSpan={3} rowSpan={3}><img src={receipt.cooperative.cooperative_sign} alt="Imagen en base64"/></StyledTableCell>
                                                :
                                                <StyledTableCell align="center" colSpan={3} rowSpan={3}>No sign</StyledTableCell>
                                            }
                                            <StyledTableCell align="center" colSpan={3 }rowSpan={3}><img src={receipt.sign} alt="Imagen en base64"/></StyledTableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                    </Box>
                </Box>
            }   
        </Paper>
    )
}

export default ReceiptDetails