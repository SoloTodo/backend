import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Detail } from "src/frontend-utils/types/extras";

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
  data,
  details,
  title,
}: {
  data: any;
  details: Detail[];
  title: string;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableBody>
              {details.map(({ key, label, renderData }) =>
                Object.keys(data).length !== 0 ? (
                  <StyledTableRow key={key}>
                    <StyledTableCell scope="row">{label}</StyledTableCell>
                    <StyledTableCell style={{ wordBreak: "break-word" }}>
                      {renderData ? renderData(data) : data[key]}
                    </StyledTableCell>
                  </StyledTableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
