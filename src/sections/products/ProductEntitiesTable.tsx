import { Box } from "@mui/material";
import { GridColDef, GridRowIdGetter } from "@mui/x-data-grid";
import { useContext } from "react";
import { StyledDataGrid } from "src/components/my_components/StyledDatGrid";
import Scrollbar from "src/components/Scrollbar";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { Entity } from "src/frontend-utils/types/entity";

export default function ProductEntitiesTable({
  columns,
  getRowId,
}: {
  columns: GridColDef[];
  getRowId?: GridRowIdGetter<any>;
}) {
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = [];

  const currentEntities = currentResult.map(({
    entity,
    _pricing_history,
  }: {
    entity: Entity;
    _pricing_history: any[];
  }) => entity)

  return (
    <Scrollbar>
      <Box sx={{ height: 500, width: "100%" }}>
        <StyledDataGrid
          columns={columns}
          rows={currentEntities}
          rowsPerPageOptions={[100]}
          getRowId={getRowId}
          rowHeight={104}
        />
      </Box>
    </Scrollbar>
  );
}
