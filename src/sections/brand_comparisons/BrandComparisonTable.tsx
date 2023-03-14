import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/components/my_components/StyledTable";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";

export default function BrandComparisonTable({
  brandComparision,
  displayStores,
}: {
  brandComparision: BrandComparison;
  displayStores: boolean;
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
                {brandComparision.brand_1.name}
              </Typography>
            </StyledTableCell>
            {displayStores &&
              brandComparision.stores.map((storeUrl) => (
                <StyledTableCell key={storeUrl}>
                  {apiResourceObjects[storeUrl].name}
                </StyledTableCell>
              ))}
            <StyledTableCell>
              <Typography variant="body2" fontWeight={700} color="secondary">
                {brandComparision.brand_2.name}
              </Typography>
            </StyledTableCell>
            {displayStores &&
              brandComparision.stores.map((storeUrl) => (
                <StyledTableCell key={storeUrl}>
                  {apiResourceObjects[storeUrl].name}
                </StyledTableCell>
              ))}
            <StyledTableCell></StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody></TableBody>
      </Table>
    </TableContainer>
  );
}
