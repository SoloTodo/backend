import { useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
// components
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import { StyledTableCell, StyledTableRow } from "../my_components/StyledTable";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";

export default function ApiFormPaginationTable({
  title,
  columns,
  withSearch,
}: {
  title: string;
  columns: GridColumns;
  withSearch?: boolean;
}) {
  const context = useContext(ApiFormContext);
  const data = context.currentResult ? context.currentResult.results : [];
  return (
    <Card>
      <CardHeader title={title} />
      {context.isLoading ? (
        <CardContent style={{ textAlign: "center" }}>
          <CircularProgress color="inherit" />
        </CardContent>
      ) : (
        <CardContent>
          <Stack spacing={1}>
            {withSearch && (
              <Box alignSelf="end">
                <ApiFormTextComponent
                  name="search"
                  label="Search..."
                  withVariant
                />
              </Box>
            )}
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
                  {data.map((row: any) => (
                    <StyledTableRow key={row.id}>
                      {columns.map((col) => (
                        <StyledTableCell key={col.field}>
                          {col.renderCell
                            ? col.renderCell(row)
                            : row[col.field]}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <ApiFormPaginationComponent />
          </Stack>
        </CardContent>
      )}
    </Card>
  );
}
