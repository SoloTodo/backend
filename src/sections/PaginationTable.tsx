import {
  Card,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColumns } from "@mui/x-data-grid";
// components

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

type PagintationData = {
  count: number;
  next: string;
  previous: string;
  results: any[];
};

export default function BasicTable({
  title,
  columns,
  data,
  query,
}: {
  title: string;
  columns: GridColumns;
  data: PagintationData;
  query: {
    page_size?: number;
    page?: number;
  };
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableBody>
              {data.results.map((row) => (
                <StyledTableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.renderCell
                        ? col.renderCell(row)
                        : row[col.field]}
                    </TableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination 
                  rowsPerPageOptions={[5, 10 ,25]}
                  colSpan={3}
                  count={data.count}
                  rowsPerPage={query.page_size ? query.page_size : 5}
                  page={query.page ? query.page - 1 : 0}
                  onPageChange={() => {}}
                  onRowsPerPageChange={() => {}}
                  />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
