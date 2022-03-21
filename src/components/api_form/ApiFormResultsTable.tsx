import { useContext } from "react";
// @mui
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
} from "@mui/material";
// components
import Scrollbar from "../Scrollbar";
// context
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { Store } from "src/frontend-utils/types/store";
import { fDateTimeSuffix } from "src/utils/formatTime";

export default function BasicTable() {
  const context = useContext(ApiFormContext);
  const stores = context.currentResult;
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">País</TableCell>
              <TableCell align="right">Tipo</TableCell>
              <TableCell align="right">Última&nbsp;Activación</TableCell>
              <TableCell align="right">Scraper</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((row: Store) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.country}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.last_activation ? fDateTimeSuffix(row.last_activation) : ""}</TableCell>
                <TableCell align="right">{row.storescraper_class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}
