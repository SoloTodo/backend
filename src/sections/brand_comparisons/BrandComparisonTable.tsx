import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { Fragment } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/components/my_components/StyledTable";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import DeleteSegmentButton from "./DeleteSegmentButton";
import EditSegmentName from "./EditSegmentName";
import MoveSegmentButton from "./MoveSegmentButton";

type BrandRowData = {
  entities: Entity[];
  product: InLineProduct;
  rowIds: number[];
};

export default function BrandComparisonTable({
  brandComparison,
  displayStores,
  onComparisonChange,
  brand1RowData,
  brand2RowData,
}: {
  brandComparison: BrandComparison;
  displayStores: boolean;
  onComparisonChange: Function;
  brand1RowData: BrandRowData[] | undefined;
  brand2RowData: BrandRowData[] | undefined;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>
              <Typography variant="body2" fontWeight={700} color="secondary">
                {brandComparison.brand_1.name}
              </Typography>
            </StyledTableCell>
            {displayStores &&
              brandComparison.stores.map((storeUrl) => (
                <StyledTableCell key={storeUrl}>
                  {apiResourceObjects[storeUrl].name}
                </StyledTableCell>
              ))}
            <StyledTableCell>
              <Typography variant="body2" fontWeight={700} color="secondary">
                {brandComparison.brand_2.name}
              </Typography>
            </StyledTableCell>
            {displayStores &&
              brandComparison.stores.map((storeUrl) => (
                <StyledTableCell key={storeUrl}>
                  {apiResourceObjects[storeUrl].name}
                </StyledTableCell>
              ))}
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {brandComparison.segments.map((segment, segmentIndex) => (
            <Fragment key={segment.ordering}>
              {segment.rows.map((row, rowIndex) => (
                <StyledTableRow key={row.ordering}>
                  {rowIndex === 0 && (
                    <StyledTableCell rowSpan={segment.rows.length}>
                      <Stack direction="row" spacing={2}>
                        <Stack direction="column" spacing={1}>
                          <DeleteSegmentButton
                            segment={segment}
                            onComparisonChange={onComparisonChange}
                          />
                          <EditSegmentName
                            segment={segment}
                            onComparisonChange={onComparisonChange}
                          />
                          <MoveSegmentButton
                            segment={segment}
                            onComparisonChange={onComparisonChange}
                            direction="up"
                            disabled={segmentIndex === 0}
                          />
                          <MoveSegmentButton
                            segment={segment}
                            onComparisonChange={onComparisonChange}
                            direction="down"
                            disabled={
                              segmentIndex ===
                              brandComparison.segments.length - 1
                            }
                          />
                        </Stack>
                        <Typography
                          style={{ writingMode: "vertical-lr" }}
                          noWrap
                          textAlign="center"
                        >
                          {segment.name}
                        </Typography>
                      </Stack>
                    </StyledTableCell>
                  )}
                  <StyledTableCell>Select product</StyledTableCell>
                  {displayStores &&
                    brandComparison.stores.map((storeUrl, storeIndex) => (
                      <StyledTableCell key={storeIndex}>
                        precio tienda
                      </StyledTableCell>
                    ))}
                  <StyledTableCell>Select product 2</StyledTableCell>
                  {displayStores &&
                    brandComparison.stores.map((storeUrl, storeIndex) => (
                      <StyledTableCell key={storeIndex}>
                        precio tienda 2
                      </StyledTableCell>
                    ))}
                  <StyledTableCell>Final</StyledTableCell>
                </StyledTableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
