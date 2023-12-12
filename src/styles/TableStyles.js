import { TableCell } from "@mui/material";
import styled from "styled-components";

export const StyledTableCell = styled(TableCell)(() => ({
    borderRight: '1px solid #e0e0e0', // Color del borde
    '&:last-child': {
    borderRight: 'none',
    },
    backgroundColor: 'white'
}));

export const StyledTableCellGrey = styled(TableCell)(() => ({
    borderRight: '1px solid #e0e0e0', // Color del borde
    '&:last-child': {
    borderRight: 'none',
    },
    backgroundColor: '#f3f3f3'
}));