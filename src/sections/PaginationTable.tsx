import { useContext } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColumns } from "@mui/x-data-grid";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { PagintationData } from "src/frontend-utils/api_form/fields/pagination/ApiFormPagination";
// components

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    boxShadow: "0 0 0 0",
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

export default function BasicTableWithPagination({
  title,
  columns,
}: {
  title: string;
  columns: GridColumns;
}) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult as PagintationData;

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <StyledTableRow>
                {columns.map((col) => (
                  <StyledTableCell key={col.field}>
                    {col.headerName}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.results.map((row) => (
                <StyledTableRow key={row.id}>
                  {columns.map((col) => (
                    <StyledTableCell key={col.field}>
                      {col.renderCell ? col.renderCell(row) : row[col.field]}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ApiFormPaginationComponent />
      </CardContent>
    </Card>
  );
}
