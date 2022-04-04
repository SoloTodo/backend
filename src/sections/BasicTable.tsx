import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function BasicTable({
  title,
  columns,
  data,
  setSelectedRows,
}: {
  title: string;
  columns: GridColDef[];
  data: [];
  setSelectedRows?: Function;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Box sx={{ height: 500, width: "100%" }}>
          {setSelectedRows ? (
            <DataGrid
              columns={columns}
              rows={data}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(ids) => setSelectedRows(ids)}
              rowsPerPageOptions={[]}
            />
          ) : (
            <DataGrid columns={columns} rows={data} rowsPerPageOptions={[]} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
