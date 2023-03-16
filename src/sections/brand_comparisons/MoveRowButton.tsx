import { IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Row } from "src/frontend-utils/types/brand_comparison";

export default function MoveRowButton({
  row,
  direction,
  disabled,
  onComparisonChange,
}: {
  row: Row;
  direction: "up" | "down";
  disabled: boolean;
  onComparisonChange: Function;
}) {
  const handleClick = () => {
    if (disabled) {
      return;
    }

    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparison_segment_rows}${row.id}/move/`,
      {
        method: "POST",
        body: JSON.stringify({
          direction: direction,
        }),
      }
    ).then((_) => onComparisonChange());
  };

  return (
    <IconButton onClick={handleClick} disabled={disabled} size="small">
      {direction === "up" ? (
        <ArrowUpwardIcon sx={{ fontSize: 15 }} />
      ) : (
        <ArrowDownwardIcon sx={{ fontSize: 15 }} />
      )}
    </IconButton>
  );
}
