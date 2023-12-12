import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableCellGrey } from "../styles/TableStyles";

const CooperativeModal = ({ cooperative }) => {
    return (
        <TableContainer sx={{marginLeft:'10px', marginRight:'10px'}} component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <StyledTableCellGrey align="center" colSpan={3}><strong>ID</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={3}><strong>Name</strong></StyledTableCellGrey>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <StyledTableCell align="left" colSpan={3}>{cooperative?.id}</StyledTableCell>
                        <StyledTableCell align="left" colSpan={3}>{cooperative?.name}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCellGrey align="center" colSpan={3}><strong>Email</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={3}><strong>Phone Number</strong></StyledTableCellGrey>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell align="center" colSpan={3}>{cooperative?.user?.email}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={3}>{cooperative?.phone_number}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCellGrey align="center" colSpan={6}><strong>Address</strong></StyledTableCellGrey>
                    </TableRow>
                    <TableRow>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Road Type</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={2}><strong>Road name</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Road number</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Road letter</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Road km</strong></StyledTableCellGrey>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.road_type}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={2}>{cooperative?.address.road_name}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.road_number}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.road_letter}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.road_km}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Block</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Portal</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Stair</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Floor</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Door</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Town entity</strong></StyledTableCellGrey>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.block}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.portal}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.stair}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.floor}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.door}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.town_entity}</StyledTableCell>
                    </TableRow>
                    <TableRow>
                        <StyledTableCellGrey align="center" colSpan={2}><strong>Town name</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={2}><strong>Province</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Country</strong></StyledTableCellGrey>
                        <StyledTableCellGrey align="center" colSpan={1}><strong>Postal code</strong></StyledTableCellGrey>
                    </TableRow>
                    <TableRow>
                        <StyledTableCell align="center" colSpan={2}>{cooperative?.address.town_name}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={2}>{cooperative?.address.province}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.country}</StyledTableCell>
                        <StyledTableCell align="center" colSpan={1}>{cooperative?.address.postal_code}</StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        
    )
}

export default CooperativeModal
