import { useState } from "react";
// @mui
import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Scrollbar from "../../components/Scrollbar";
//
import SortingSelectingHead, { TableHead } from "./SortingSelectingHead";

// ----------------------------------------------------------------------

type SortItem = {
  [id: string]: any;
};

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

// ----------------------------------------------------------------------

type Anonymous = Record<string | number, string>;

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string, sortFunction: Function | null) {
  let valueA: any = a
  let valueB: any = b
  if (sortFunction !== null) {
    valueA = sortFunction(valueA)
    valueB = sortFunction(valueB)
  }
  if (valueB < valueA) {
    return -1;
  }
  if (valueB > valueA) {
    return 1;
  }
  return 0;
}

function getComparator(order: string, orderBy: string, sortFunction: Function | null) {
  return order === "desc"
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy, sortFunction)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy, sortFunction);
}

function stableSort(array: SortItem[], comparator: (a: any, b: any) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function SortingSelecting({
  TABLE_HEAD,
  SORTING_SELECTING_TABLE,
  initialOrder="",
  initialRenderSort=null
} : {
  TABLE_HEAD: TableHead[],
  SORTING_SELECTING_TABLE: any[],
  initialOrder?: string,
  initialRenderSort?: Function | null
}) {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState(initialOrder);
  const [renderSort, setRenderSort] = useState<Function | null>(initialRenderSort);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (property: string, f: Function | null) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setRenderSort(() => f);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty SORTING_SELECTING_TABLE.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - SORTING_SELECTING_TABLE.length)
      : 0;

  return (
    <div>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <SortingSelectingHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(
                SORTING_SELECTING_TABLE,
                getComparator(order, orderBy, renderSort)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                    >
                      {TABLE_HEAD.map((t) => (
                        <StyledTableCell key={t.id}>
                          {t.renderCell ? t.renderCell(row) : row[t.id]}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: "relative" }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={SORTING_SELECTING_TABLE.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, page) => handleChangePage(page)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </div>
  );
}
