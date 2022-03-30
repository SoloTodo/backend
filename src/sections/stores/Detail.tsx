import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Store } from "src/frontend-utils/types/store";
import { fDateTimeSuffix } from "src/utils/formatTime";

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

export default function CustomizedTables({
  store,
  apiResourceObjects,
}: {
  store: Store;
  apiResourceObjects: any;
}) {
  return (
    <Card>
      <CardHeader title={`${store.name}`} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableBody>
              <StyledTableRow key="name">
                <StyledTableCell scope="row">Nombre</StyledTableCell>
                <StyledTableCell>{store.name}</StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key="type">
                <StyledTableCell scope="row">Tipo</StyledTableCell>
                <StyledTableCell>
                  {apiResourceObjects[store.type].name}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key="country">
                <StyledTableCell scope="row">País</StyledTableCell>
                <StyledTableCell>
                  {apiResourceObjects[store.country].name}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key="last_activation">
                <StyledTableCell scope="row">Última Activación</StyledTableCell>
                <StyledTableCell>
                  {fDateTimeSuffix(store.last_activation)}
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow key="storescraper_class">
                <StyledTableCell scope="row">Scraper</StyledTableCell>
                <StyledTableCell>{store.storescraper_class}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
