import {
  Autocomplete,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import LightModeIcon from "@mui/icons-material/LightMode";
import { BrandRowData, Row } from "src/frontend-utils/types/brand_comparison";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

type Option = {
  label: string;
  value: string;
  groupBy: string;
  option: {
    name: string;
    id: number;
  } & BrandRowData;
};

export default function SelectProduct({
  options,
  row,
  brandIndex,
  onComparisonChange,
}: {
  options: Option[];
  row: Row;
  brandIndex: string;
  onComparisonChange: Function;
}) {
  const onProductChange = (_: any, v: Option | null) => {
    const value = v ? v.option.id : null;
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparison_segment_rows}${row.id}/`,
      {
        method: "PATCH",
        body: JSON.stringify({
          [`product_${brandIndex}`]: value,
        }),
      }
    ).then((_) => onComparisonChange());
  };

  const onHighlightClick = (isHighlighted: boolean) => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparison_segment_rows}${row.id}/`,
      {
        method: "PATCH",
        body: JSON.stringify({
          [`is_product_${brandIndex}_highlighted`]: !isHighlighted,
        }),
      }
    ).then((_) => onComparisonChange());
  };

  const getProductWarnings = (productOption: any) => {
    const warnings = [];
    if (productOption) {
      const data = productOption.option;
      if (data.rowIds.length > 1) {
        warnings.push("Este producto ya ha sido ingresado.");
      }
      if (!data.entities.length) {
        warnings.push("Producto no disponible.");
      }
    }
    return warnings;
  };

  const product = row[`product_${brandIndex}` as "product_1"];
  const productOption = product
    ? options.filter((option) => option.value === product.id.toString())[0] ||
      null
    : null;
  const isHighlighted =
    row[`is_product_${brandIndex}_highlighted` as "is_product_1_highlighted"];
  const warnings = getProductWarnings(productOption).reduce(
    (acc, a) => `${acc} ${a}`,
    ""
  );
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {warnings && (
        <Tooltip title={warnings}>
          <WarningIcon fontSize="small" />
        </Tooltip>
      )}
      <Autocomplete
        options={options}
        groupBy={(option) => option.groupBy}
        renderInput={(params) => <TextField {...params} label="Select..." />}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.label}
          </li>
        )}
        value={productOption}
        onChange={onProductChange}
        size="small"
        sx={{
          width: 200,
        }}
      />
      <IconButton onClick={() => onHighlightClick(isHighlighted)}>
        <LightModeIcon color={isHighlighted ? "primary" : "inherit"} />
      </IconButton>
    </Stack>
  );
}
