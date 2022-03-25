import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card, CardHeader } from "@mui/material";
import { Store } from "src/frontend-utils/types/store";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables({ store } : { store: Store }) {
  return (
    <Card style={{ padding: 10 }}>
      <CardHeader title={`${store.name}`} sx={{ mb: 3 }} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableBody>
           
              <StyledTableRow key={store.name}>
                <StyledTableCell scope="row">
                  Nombre
                </StyledTableCell>
                <StyledTableCell>{store.name}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={store.type}>
                <StyledTableCell scope="row">
                  Tipo
                </StyledTableCell>
                <StyledTableCell>{store.type}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={store.country}>
                <StyledTableCell scope="row">
                  País
                </StyledTableCell>
                <StyledTableCell>{store.country}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={store.last_activation}>
                <StyledTableCell scope="row">
                  Última Activación
                </StyledTableCell>
                <StyledTableCell>{store.last_activation}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key={store.storescraper_class}>
                <StyledTableCell scope="row">
                  Scraper
                </StyledTableCell>
                <StyledTableCell>{store.storescraper_class}</StyledTableCell>
              </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
