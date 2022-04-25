import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";

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

export default function CustomTable({
  data,
  columns,
}: {
  data: any[];
  columns: GridColumns;
}) {
  return (
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
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              {columns.map((col) => (
                <StyledTableCell key={col.field}>
                  {col.renderCell
                    ? col.renderCell({ row: row } as GridRenderCellParams<any, any, any>)
                    : row[col.field]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
