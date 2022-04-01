import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
// components
import Scrollbar from "src/components/Scrollbar";

export default function BasicTable({
  title,
  columns,
  data,
}: {
  title: string;
  columns: GridColumns;
  data: [];
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Scrollbar>
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={data}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </Scrollbar>
      </CardContent>
    </Card>
  );
}
