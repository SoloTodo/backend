import {
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Theme,
  Paper,
  IconButton,
} from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";
import NextLink from "next/link";
import LinkIcon from "@mui/icons-material/Link";
import {
  GridColumns,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import React, { useContext, useState } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { useAppSelector } from "src/store/hooks";
import { PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
import { Brand } from "src/frontend-utils/types/banner";
// currency
import currency from "currency.js";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

type Results = {
  cell_plan: InLineProduct | null;
  entities: Entity[];
  product: Product;
  min_offer: number;
  min_normal: number;
  subResults?: {
    cell_plan: InLineProduct | null;
    entities: Entity[];
    product: Product;
    min_offer: number;
    min_normal: number;
  }[];
};

const StyledTableCell = withStyles((theme: Theme) =>
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
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

function Row({
  columnsIG,
  columnsMin,
  columnsStores,
  result,
  dataHasCellPlans,
}: {
  columnsIG: GridColumns<Results>;
  columnsMin: GridColumns<Results>;
  columnsStores: GridColumns<Results>;
  result: Results;
  dataHasCellPlans: boolean;
}) {
  const [open, setOpen] = useState(false);
  const brandCol = columnsIG.filter((c) => c.field === "brand")[0];
  return (
    <React.Fragment>
      <StyledTableRow>
        <StyledTableCell>
          {dataHasCellPlans ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : (
            ""
          )}
        </StyledTableCell>
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
                } as GridRenderCellParams<any, Results, any>)
              : ""}
          </StyledTableCell>
        ))}
        {columnsStores.map((col) => (
          <StyledTableCell key={col.field}>
            {col.renderCell
              ? col.renderCell({
                  row: result,
                } as GridRenderCellParams<any, Results, any>)
              : ""}
          </StyledTableCell>
        ))}
      </StyledTableRow>
      {dataHasCellPlans &&
        result.subResults &&
        result.subResults.map((r, index) => (
          <StyledTableRow key={index} style={{ display: open ? "" : "none" }}>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>
              {r.cell_plan ? r.cell_plan.name : "Liberado"}
            </StyledTableCell>
            <StyledTableCell>
              {brandCol.renderCell
                ? brandCol.renderCell({
                    row: r,
                  } as GridRenderCellParams<any, Results, any>)
                : ""}
            </StyledTableCell>
            {columnsMin.map((col, index) => (
              <StyledTableCell key={`${col.headerName}-${index}`}>
                {col.renderCell
                  ? col.renderCell({
                      row: result,
                    } as GridRenderCellParams<any, Results, any>)
                  : ""}
              </StyledTableCell>
            ))}
            {columnsStores.map((col) => (
              <StyledTableCell key={col.field}>
                {col.renderCell
                  ? col.renderCell({
                      row: result,
                    } as GridRenderCellParams<any, Results, any>)
                  : ""}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
    </React.Fragment>
  );
}

export default function CategoryDetailBrowseTable({
  brands,
}: {
  brands: Brand[];
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const context = useContext(ApiFormContext);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const stores = getApiResourceObjects(apiResourceObjects, "stores");

  let currentResult = context.currentResult;
  if (currentResult === null) currentResult = { results: [] };

  const storeUrlSet = new Set();
  currentResult.results.forEach((entry: { entities: Entity[] }) => {
    entry.entities.forEach((entity: Entity) => {
      storeUrlSet.add(entity.store);
    });
  });
  const currentStores = stores.filter((store) => storeUrlSet.has(store.url));

  const dataHasCellPlans = currentResult.results.some(
    (entry: { cell_plan: any }) => entry.cell_plan
  );

  const minPriceByField = (
    result: Results,
    field: "normal_price" | "offer_price"
  ) => {
    const sortedEntities = result.entities.sort((a, b) => {
      if (typeof a.active_registry === "undefined") {
        return 1;
      } else if (typeof b.active_registry === "undefined") {
        return -1;
      } else {
        return (
          Number(a.active_registry[field]) - Number(b.active_registry[field])
        );
      }
    });
    return typeof sortedEntities[0].active_registry !== "undefined"
      ? Number(sortedEntities[0].active_registry[field])
      : 0;
  };

  let results = currentResult.results;
  results = Object.values(
    currentResult.results.reduce((acc: Record<number, Results>, a: Results) => {
      const min_offer = minPriceByField(a, "offer_price");
      const min_normal = minPriceByField(a, "normal_price");

      const actual_min_offer = acc[a.product.id] && acc[a.product.id].min_offer;
      const actual_subResults =
        acc[a.product.id] && acc[a.product.id].subResults;
      if (
        dataHasCellPlans &&
        typeof actual_min_offer !== "undefined" &&
        typeof actual_subResults != "undefined"
      ) {
        if (actual_min_offer < min_offer) {
          acc[a.product.id] = {
            ...acc[a.product.id],
            subResults: [
              ...actual_subResults,
              {
                ...a,
                min_normal: min_normal,
                min_offer: min_offer,
              },
            ],
          };
        } else {
          acc[a.product.id] = {
            ...a,
            min_normal: min_normal,
            min_offer: min_offer,
            subResults: [
              ...actual_subResults,
              {
                ...a,
                min_normal: min_normal,
                min_offer: min_offer,
              },
            ],
          };
        }
      } else {
        acc[a.product.id] = {
          ...a,
          min_normal: min_normal,
          min_offer: min_offer,
          subResults: [
            {
              ...a,
              min_normal: min_normal,
              min_offer: min_offer,
            },
          ],
        };
      }
      return acc;
    }, {})
  );

  const brandsDict = brands.reduce((acc: Record<string, Brand>, a) => {
    acc[a.url] = a;
    return acc;
  }, {});

  const storePriceText = (
    e: Entity[],
    minPrice: number,
    field: "normal_price" | "offer_price"
  ) => {
    return (
      <Stack spacing={1} direction="column">
        {e.map((entity) => (
          <Stack spacing={1} direction="row" key={entity.id}>
            <NextLink href={`${PATH_ENTITY.root}/${entity.id}`} passHref>
              <Link
                color={
                  Number(
                    entity.active_registry && entity.active_registry[field]
                  ) === minPrice
                    ? "green"
                    : "primary"
                }
              >
                {currency(
                  entity.active_registry ? entity.active_registry[field] : 0,
                  {
                    precision: 0,
                  }
                ).format()}
              </Link>
            </NextLink>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={entity.external_url}
              color={
                Number(
                  entity.active_registry && entity.active_registry[field]
                ) === minPrice
                  ? "green"
                  : "primary"
              }
            >
              <LinkIcon />
            </Link>
          </Stack>
        ))}
      </Stack>
    );
  };

  const minPriceAccordion = (
    result: Results,
    minPrice: number,
    field: "normal_price" | "offer_price"
  ) => {
    const filteredEntities = result.entities.filter(
      (e) => e.active_registry && Number(e.active_registry[field]) === minPrice
    );
    return (
      <Paper elevation={1}>
        <Accordion>
          <AccordionSummary>
            {currency(minPrice, {
              precision: 0,
            }).format()}
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1} direction="column">
              {filteredEntities.map((f) => (
                <Stack spacing={1} direction="row" key={f.id}>
                  <NextLink href={`${PATH_ENTITY.root}/${f.id}`} passHref>
                    <Link>{apiResourceObjects[f.store].name}</Link>
                  </NextLink>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={f.external_url}
                  >
                    <LinkIcon />
                  </Link>
                </Stack>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Paper>
    );
  };

  const columnsIG: GridColumns<Results> = [
    {
      headerName: "Producto",
      field: "product",
      renderCell: (params) => (
        <NextLink
          href={`${PATH_PRODUCT.root}/${params.row.product.id}`}
          passHref
        >
          <Link>{params.row.product.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Marca",
      field: "brand",
      renderCell: (params) => brandsDict[params.row.product.brand].name,
    },
  ];

  if (dataHasCellPlans)
    columnsIG.splice(1, 0, {
      headerName: "Plan celular",
      field: "cell_plan",
      renderCell: (_params) => "Cualquiera",
    });

  const columnsMin: GridColumns<Results> = [
    {
      headerName: "Normal",
      field: "min_normal",
      renderCell: (params) =>
        minPriceAccordion(params.row, params.row.min_normal, "normal_price"),
    },
    {
      headerName: "Oferta",
      field: "offer_price",
      renderCell: (params) =>
        minPriceAccordion(params.row, params.row.min_offer, "offer_price"),
    },
  ];

  const columnsStores: GridColumns<Results> = [];

  currentStores.forEach((store) =>
    columnsStores.push(
      {
        headerName: "Normal",
        field: `normal_price_${store.id}`,
        renderCell: (params) => {
          const e = params.row.entities.filter(
            (entity) => entity.store === store.url
          );
          return storePriceText(e, params.row.min_normal, "normal_price");
        },
      },
      {
        headerName: "Oferta",
        field: `offer_price_${store.id}`,
        renderCell: (params) => {
          const e = params.row.entities.filter(
            (entity) => entity.store === store.url
          );
          return storePriceText(e, params.row.min_offer, "offer_price");
        },
      }
    )
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
                colSpan={columnsIG.length}
                component="th"
              >
                Información General
              </StyledTableCell>
              <StyledTableCell align="center" colSpan={2}>
                Mínimos
              </StyledTableCell>
              {currentStores.map((store) => (
                <StyledTableCell align="center" colSpan={2} key={store.id}>
                  {store.name}
                </StyledTableCell>
              ))}
            </TableRow>
            <TableRow>
              <StyledTableCell />
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
                </StyledTableCell>
              ))}
              {columnsStores.map((col) => (
                <StyledTableCell key={col.field} align="center">
                  {col.headerName}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {results
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((result: Results, index: number) => {
                return (
                  <Row
                    key={index}
                    columnsIG={columnsIG}
                    columnsMin={columnsMin}
                    columnsStores={columnsStores}
                    result={result}
                    dataHasCellPlans={dataHasCellPlans}
                  />
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        component="div"
        colSpan={3}
        count={currentResult.results.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por pág."
      />
    </>
  );
}
