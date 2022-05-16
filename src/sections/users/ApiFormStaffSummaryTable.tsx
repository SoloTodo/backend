import { Stack, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import CustomTable from "../CustomTable";
import currency from "currency.js";

export default function ApiFormStaffSummaryTable({
  columns,
}: {
  columns: GridColDef[];
}) {
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = [];

  const currentItems = [
    { id: "Entidades asociadas", ...currentResult.entities },
    { id: "Entidades WTB asociadas", ...currentResult.wtb_entities },
    { id: <strong>Productos creados</strong> },
  ];

  if (currentResult.products)
    currentItems.push(
      ...currentResult.products.map((p: { tier: string }) => ({
        id: p.tier,
        ...p,
      }))
    );

  return (
    <div>
      <CustomTable data={currentItems} columns={columns} />
      <br />
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
        mr={4}
      >
        <Typography variant="h6">
          <strong>
            Total:{" "}
            {currency(currentResult.total_amount, {
              precision: 0,
            }).format()}
          </strong>
        </Typography>
      </Stack>
    </div>
  );
}
