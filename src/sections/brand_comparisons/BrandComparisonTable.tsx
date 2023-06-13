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
import {
  BrandComparison,
  BrandRowData,
} from "src/frontend-utils/types/brand_comparison";
import AddRowButton from "./AddRowButton";
import DeleteRowButton from "./DeleteRowButton";
import DeleteSegmentButton from "./DeleteSegmentButton";
import EditSegmentName from "./EditSegmentName";
import MoveRowButton from "./MoveRowButton";
import MoveSegmentButton from "./MoveSegmentButton";
import SegmentRowPriceCell from "./SegmentRowPriceCell";
import SelectProduct from "./SelectProduct";

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

  const createOptionsWithGroup = (rowData: BrandRowData[] | undefined) => {
    const customCreateOptions = (
      localRowData: BrandRowData[] | undefined,
      groupBy: string
    ) => {
      if (localRowData) {
        const o = localRowData.map((data) => ({
          ...data,
          name: data.product.name,
          id: data.product.id,
        }));
        return o.map((d) => ({
          value: d.id.toString(),
          label: d.name,
          option: d,
          groupBy: groupBy,
        }));
      } else {
        return [];
      }
    };

    return [
      ...customCreateOptions(
        rowData?.filter((data) => data.entities.length && !data.rowIds.length),
        "Pendientes"
      ),
      ...customCreateOptions(
        rowData?.filter((data) => data.entities.length && data.rowIds.length),
        "Ya ingresados"
      ),
      ...customCreateOptions(
        rowData?.filter((data) => !data.entities.length),
        "No disponibles"
      ),
    ];
  };

  const brand1Options = createOptionsWithGroup(brand1RowData);
  const brand2Options = createOptionsWithGroup(brand2RowData);

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
                <StyledTableRow
                  key={row.ordering}
                  sx={{
                    borderBottom: rowIndex == segment.rows.length - 1 ? 1 : 0,
                  }}
                >
                  {rowIndex === 0 && (
                    <StyledTableCell
                      rowSpan={segment.rows.length}
                      sx={{
                        p: 1,
                        width: "10%",
                      }}
                    >
                      <Stack direction="row" spacing={1}>
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
                  <StyledTableCell
                    sx={{
                      ":first-of-type": {
                        p: 2,
                      },
                    }}
                  >
                    {brand1RowData && (
                      <SelectProduct
                        options={brand1Options}
                        row={row}
                        brandIndex="1"
                        onComparisonChange={onComparisonChange}
                      />
                    )}
                  </StyledTableCell>
                  {displayStores &&
                    brandComparison.stores.map((storeUrl, storeIndex) => (
                      <StyledTableCell key={storeIndex}>
                        <SegmentRowPriceCell
                          storeUrl={storeUrl}
                          product={row.product_1}
                          rowData={brand1RowData}
                          comparisonProduct={row.product_2}
                          comparisonRowData={brand2RowData}
                          priceType={brandComparison.price_type}
                        />
                      </StyledTableCell>
                    ))}
                  <StyledTableCell>
                    {brand2RowData && (
                      <SelectProduct
                        options={brand2Options}
                        row={row}
                        brandIndex="2"
                        onComparisonChange={onComparisonChange}
                      />
                    )}
                  </StyledTableCell>
                  {displayStores &&
                    brandComparison.stores.map((storeUrl, storeIndex) => (
                      <StyledTableCell key={storeIndex}>
                        <SegmentRowPriceCell
                          storeUrl={storeUrl}
                          product={row.product_2}
                          rowData={brand2RowData}
                          priceType={brandComparison.price_type}
                        />
                      </StyledTableCell>
                    ))}
                  <StyledTableCell>
                    <Stack spacing={1} direction="row">
                      <Stack>
                        <MoveRowButton
                          row={row}
                          onComparisonChange={onComparisonChange}
                          direction="up"
                          disabled={rowIndex === 0}
                        />
                        <MoveRowButton
                          row={row}
                          onComparisonChange={onComparisonChange}
                          direction="down"
                          disabled={rowIndex === segment.rows.length - 1}
                        />
                      </Stack>
                      <Stack>
                        <DeleteRowButton
                          row={row}
                          disabled={rowIndex === 0}
                          onComparisonChange={onComparisonChange}
                        />
                        <AddRowButton
                          row={row}
                          segment={segment}
                          onComparisonChange={onComparisonChange}
                        />
                      </Stack>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
