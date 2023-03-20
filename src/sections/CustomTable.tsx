import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/components/my_components/StyledTable";

export default function CustomTable({
  data,
  columns,
  withoutMinWidth,
}: {
  data: any[];
  columns: GridColumns;
  withoutMinWidth?: boolean;
}) {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={withoutMinWidth ? {} : { minWidth: 700 }}
        aria-label="customized table"
      >
        <TableHead>
          <StyledTableRow>
            {columns.map((col, index) => (
              <StyledTableCell key={index}>{col.headerName}</StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {columns.map((col, index) => (
                <StyledTableCell key={index}>
                  {col.renderCell
                    ? col.renderCell({ row: row } as GridRenderCellParams<
                        any,
                        any,
                        any
                      >)
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
