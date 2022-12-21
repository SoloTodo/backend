import { Box, Card, CardContent, CardHeader, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";

function QuickSearchToolbar() {
  return (
    <Stack
      alignItems="end"
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
    </Stack>
  );
}

export default function BasicTable({
  title,
  columns,
  data,
  setSelectedRows,
}: {
  title: string;
  columns: GridColDef[];
  data: any[];
  setSelectedRows?: Function;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ height: "70vh", width: "100%" }}>
          {setSelectedRows ? (
            <DataGrid
              columns={columns}
              rows={data}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => setSelectedRows(ids)}
              rowsPerPageOptions={[100]}
              disableColumnSelector
              components={{ Toolbar: QuickSearchToolbar }}
            />
          ) : (
            <DataGrid
              columns={columns}
              rows={data}
              rowsPerPageOptions={[100]}
              disableSelectionOnClick
              disableColumnSelector
              disableDensitySelector
              components={{ Toolbar: QuickSearchToolbar }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
