import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";
import NextLink from "next/link";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useContext, useState } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { PATH_PRODUCT } from "src/routes/paths";
import {
  ProductBrowseResult
} from "../../frontend-utils/types/product_browse";
import {CategoryColumn} from "../../frontend-utils/types/store";
import {
  ApiFormPaginationData
} from "../../frontend-utils/api_form/fields/pagination/ApiFormPagination";
import {formatCurrency} from "../../utils/formatNumber";
import {useAppSelector} from "../../frontend-utils/redux/hooks";
import {
  useApiResourceObjects
} from "../../frontend-utils/redux/api_resources/apiResources";
import {Currency} from "../../frontend-utils/redux/api_resources/types";

const StyledTableCell = withStyles(() =>
  createStyles({
    root: {
      whiteSpace: "nowrap",
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(even)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

function Row({
  columnsIG,
  columnsMin,
  result,
    columns
}: {
  columnsIG: GridColumns<ProductBrowseResult>;
  columnsMin: GridColumns<ProductBrowseResult>;
  result: ProductBrowseResult;
  columns: CategoryColumn[]
}) {
  return (
    <React.Fragment>
      <StyledTableRow>
        {columnsIG.map((col) => (
          <StyledTableCell key={col.field} component="th">
            {col.renderCell
              ? col.renderCell({
                  row: result,
                } as GridRenderCellParams<any, any, any>)
              : ""}
          </StyledTableCell>
        ))}
        {columnsMin.map((col, index) => (
          <StyledTableCell key={`${col.headerName}-${index}`}>
            {col.renderCell
              ? col.renderCell({
                  row: result,
                } as GridRenderCellParams<any, ProductBrowseResult, any>)
              : ""}
          </StyledTableCell>
        ))}
        {columns.map(col => (
            <StyledTableCell key={col.es_field}>

            </StyledTableCell>
        ))}
      </StyledTableRow>
    </React.Fragment>
  );
}

export default function CategoryDetailBrowseTable({columns}: {columns:CategoryColumn[]}) {
  const context = useContext(ApiFormContext);
  let currentResult = context.currentResult;
  if (currentResult === null) return null;
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const columnsIG: GridColumns<ProductBrowseResult> = [
    {
      headerName: "Producto",
      field: "product",
      renderCell: (params) => {
        return <NextLink
            href={`${PATH_PRODUCT.root}/${params.row.product_entries[0].product.id}`}
            passHref
        >
          <Link>{params.row.product_entries[0].product.name}</Link>
        </NextLink>
    },
    }
  ]

  const columnsMin: GridColumns<ProductBrowseResult> = [
    {
      headerName: "Con todo medio de pago",
      field: "min_normal",
      renderCell: (params) => {
        const currency = apiResourceObjects[params.row.product_entries[0].metadata.prices_per_currency[0].currency] as Currency
        return formatCurrency(currency, params.row.product_entries[0].metadata.prices_per_currency[0].normal_price)
      }
    },
    {
      headerName: "Con medio de pago preferente",
      field: "offer_price",
      renderCell: (params) => {
        const currency = apiResourceObjects[params.row.product_entries[0].metadata.prices_per_currency[0].currency] as Currency
        return formatCurrency(currency, params.row.product_entries[0].metadata.prices_per_currency[0].offer_price)
      }
    },
  ];

  for (const column of columns) {
    columnsMin.push(
        {
          headerName: column.label,
          field: column.es_field,
          renderCell: (params) =>
            params.row.product_entries[0].product.specs[column.es_field] || 'N/A'
        }
    )
  }

  if (context.isLoading)
    return (
      <Box textAlign={"center"}>
        <CircularProgress color="inherit" />
      </Box>
    );
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell
                align="center"
                component="th"
                colSpan={2}
              >
                Precios
              </StyledTableCell>
              <StyledTableCell
                align="center"
                component="th"
                colSpan={columns.length}
              >
                Specs
              </StyledTableCell>
            </TableRow>
            <TableRow>
              {columnsIG.map((col, index) => (
                <StyledTableCell
                  key={`${col.headerName}-${index}`}
                  align="center"
                  component="th"
                >
                  {col.headerName}
                </StyledTableCell>
              ))}
              {columnsMin.map((col, index) => (
                <StyledTableCell
                  key={`${col.headerName}-${index}`}
                  align="center"
                >
                  {col.headerName}
                </StyledTableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentResult.results
              .map((result: ProductBrowseResult, index: number) => {
                return (
                  <Row
                    key={index}
                    columnsIG={columnsIG}
                    columnsMin={columnsMin}
                    result={result}
                    columns={columns}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
