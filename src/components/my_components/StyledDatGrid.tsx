import { withStyles } from "@mui/styles";
import { DataGrid } from "@mui/x-data-grid";

export const StyledDataGrid = withStyles({
    root: {
      '& .MuiDataGrid-renderingZone': {
        maxHeight: 'none !important'
      },
      '& .MuiDataGrid-cell': {
        lineHeight: 'unset !important',
        maxHeight: 'none !important',
        whiteSpace: 'normal',
        wordWrap: 'break-word'
      },
      '& .MuiDataGrid-row': {
        maxHeight: 'none !important'
      }
    },
    virtualScrollerContent: {
      height: '100% !important',
      overflow: 'scroll'
    }
  })(DataGrid);