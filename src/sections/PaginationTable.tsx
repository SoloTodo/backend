import { useState } from "react";
import { useRouter } from "next/router";
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
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridColumns } from "@mui/x-data-grid";
// components

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    boxShadow: "0 0 0 0"
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

type PagintationData = {
  count: number;
  next: string;
  previous: string;
  results: any[];
};

export default function BasicTableWithPagination({
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
  const [page, setPage] = useState(query.page ? query.page - 1 : 0);
  const [size, setSize] = useState(
    query.page_size ? Number(query.page_size) : 5
  );
  const router = useRouter();

  const handleChange = (_event: any, value: number) => {
    setPage(value);
    const currentPath = router.pathname;
    const currentQuery = { ...router.query }; //Copy current query to avoid its removing
    currentQuery.page = (value + 1).toString();

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  const handleSize = (event: any) => {
    const value = event.target.value;
    setSize(value);
    const currentPath = router.pathname;
    const currentQuery = { ...router.query }; //Copy current query to avoid its removing
    currentQuery.page_size = value.toString();

    router.push({
      pathname: currentPath,
      query: currentQuery,
    });
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <StyledTableRow>
                {columns.map((col) => (
                  <StyledTableCell key={col.field}>{col.headerName}</StyledTableCell>
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
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={data.count}
                  rowsPerPage={size}
                  page={page}
                  onPageChange={handleChange}
                  onRowsPerPageChange={handleSize}
                  labelRowsPerPage='Filas por pág.'
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
