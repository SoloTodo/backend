import { IconButton } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Segment } from "src/frontend-utils/types/brand_comparison";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

export default function MoveSegmentButton({
  segment,
  direction,
  disabled,
  onComparisonChange,
}: {
  segment: Segment;
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
      `${apiSettings.apiResourceEndpoints.brand_comparisons_segments}${segment.id}/move/`,
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
        <ArrowUpwardIcon sx={{ fontSize: 20 }} />
      ) : (
        <ArrowDownwardIcon sx={{ fontSize: 20 }} />
      )}
    </IconButton>
  );
}
