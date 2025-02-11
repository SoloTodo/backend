import {Paper, Stack, Table, TableBody, TableContainer, TableFooter, TableHead, Typography} from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import {StyledTableCell, StyledTableRow} from "../../components/my_components/StyledTable";

type StaffMetricEntry = {
    date: string;
    disqus_comments: number;
    zendesk_solved_tickets: number;
    associated_entities: number;
    created_products: number
}


export default function ApiFormStaffSummaryTable() {
  const context = useContext(ApiFormContext);
  let result : StaffMetricEntry[] | null = context.currentResult;
  if (result === null) {
      return null
  }

  const totalDisqusComments = result.reduce((value, entry) => value + entry.disqus_comments, 0)
  const totalZendeskSolvedTickets = result.reduce((value, entry) => value + entry.zendesk_solved_tickets, 0)
  const totalAssociatedEntities = result.reduce((value, entry) => value + entry.associated_entities, 0)
  const totalCreatedProducts = result.reduce((value, entry) => value + entry.created_products, 0)

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{ minWidth: 700 }}
        aria-label="customized table"
      >
        <TableHead>
          <StyledTableRow>
              <StyledTableCell>Fecha</StyledTableCell>
              <StyledTableCell>Comentarios Disqus</StyledTableCell>
              <StyledTableCell>Tickets resueltos</StyledTableCell>
              <StyledTableCell>Entidades asociadas</StyledTableCell>
              <StyledTableCell>Productos creados</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
            {result.map(entry => <StyledTableRow key={entry.date}>
                <StyledTableCell>{entry.date}</StyledTableCell>
                <StyledTableCell>{entry.disqus_comments}</StyledTableCell>
                <StyledTableCell>{entry.zendesk_solved_tickets}</StyledTableCell>
                <StyledTableCell>{entry.associated_entities}</StyledTableCell>
                <StyledTableCell>{entry.created_products}</StyledTableCell>
            </StyledTableRow>)}
            <StyledTableRow>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell>{totalDisqusComments}</StyledTableCell>
              <StyledTableCell>{totalZendeskSolvedTickets}</StyledTableCell>
              <StyledTableCell>{totalAssociatedEntities}</StyledTableCell>
              <StyledTableCell>{totalCreatedProducts}</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
