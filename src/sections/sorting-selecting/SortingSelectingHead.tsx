// @mui
import {
  Box,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
} from "@mui/material";

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
} as const;

export type TableHead = {
  id: string;
  sortField?: string;
  renderSort?: Function;
  renderCell?: Function;
  label: string;
}

type SortingSelectingHeadProps = {
  orderBy: string;
  onRequestSort: (property: string, sortFunction: Function | null) => void;
  order: "asc" | "desc";
  headLabel: TableHead[];
};

export default function SortingSelectingHead({
  order,
  orderBy,
  headLabel,
  onRequestSort,
}: SortingSelectingHeadProps) {
  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={
              orderBy === headCell.id || orderBy === headCell.sortField
                ? order
                : false
            }
          >
            <TableSortLabel
              active={orderBy === headCell.id || orderBy === headCell.sortField}
              direction={
                orderBy === headCell.id || orderBy === headCell.sortField
                  ? order
                  : "asc"
              }
              onClick={() =>
                onRequestSort(
                  headCell.sortField ? headCell.sortField : headCell.id,
                  headCell.renderSort ? headCell.renderSort : null
                )
              }
            >
              {headCell.label}
              {orderBy === headCell.sortField ? (
                <Box component="span" sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
