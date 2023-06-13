import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Row, Segment } from "src/frontend-utils/types/brand_comparison";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";

export default function AddRowButton({
  row,
  segment,
  onComparisonChange,
}: {
  row: Row;
  segment: Segment;
  onComparisonChange: Function;
}) {
  const onClick = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.brand_comparisons_segments}${segment.id}/add_row/`,
      {
        method: "POST",
        body: JSON.stringify({ ordering: row.ordering + 1 }),
      }
    ).then((_) => onComparisonChange());
  };

  return (
    <IconButton onClick={onClick} size="small">
      <AddIcon sx={{ fontSize: 15 }} />
    </IconButton>
  );
}
