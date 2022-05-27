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
} from "@mui/material";
import { withStyles, createStyles } from "@mui/styles";
import NextLink from "next/link";
import LinkIcon from "@mui/icons-material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import { useContext, useState } from "react";
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

type Results = {
  cell_plan: InLineProduct | null;
  entities: Entity[];
  product: Product;
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

// const StyledTableRow = withStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       "&:nth-of-type(odd)": {
//         backgroundColor: theme.palette.action.hover
//       }
//     }
//   })
// )(TableRow);

const storePriceText = (
  e: Entity[],
  minPrice: number,
  field: "normal_price" | "offer_price"
) => {
  if (e.length !== 0 && typeof e[0].active_registry !== "undefined") {
    return (
      <Stack spacing={1} direction="row">
        <NextLink href={`${PATH_ENTITY.root}/${e[0].id}`} passHref>
          <Link
            color={
              Number(e[0].active_registry[field]) === minPrice
                ? "green"
                : "primary"
            }
          >
            {currency(e[0].active_registry[field], {
              precision: 0,
            }).format()}
          </Link>
        </NextLink>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={e[0].external_url}
          color={
            Number(e[0].active_registry[field]) === minPrice
              ? "green"
              : "primary"
          }
        >
          <LinkIcon />
        </Link>
      </Stack>
    );
  } else {
    return "";
  }
};

export default function CategoryDetailBrowseTable({
  brands,
}: {
  brands: Brand[];
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
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
  console.log(currentResult);

  const storeUrlSet = new Set();
  currentResult.results.forEach((entry: { entities: Entity[] }) => {
    entry.entities.forEach((entity: Entity) => {
      storeUrlSet.add(entity.store);
    });
  });
  const dataHasCellPlans = currentResult.results.some(
    (entry: { cell_plan: any }) => entry.cell_plan
  );

  const currentStores = stores.filter((store) => storeUrlSet.has(store.url));

  const brandsDict = brands.reduce((acc: Record<string, Brand>, a) => {
    acc[a.url] = a;
    return acc;
  }, {});

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

  const minPriceText = (
    result: Results,
    minPrice: number,
    field: "normal_price" | "offer_price"
  ) => {
    const filteredEntities = result.entities.filter(
      (e) => e.active_registry && Number(e.active_registry[field]) === minPrice
    );
    return (
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
      renderCell: (params) =>
        params.row.cell_plan ? params.row.cell_plan.name : "Liberado",
    });

  const columnsMin: GridColumns<Results> = [
    {
      headerName: "Normal",
      field: "normal_price",
      renderCell: (params) =>
        minPriceText(params.row, params.minPrice, "normal_price"),
    },
    {
      headerName: "Oferta",
      field: "offer_price",
      renderCell: (params) =>
        minPriceText(params.row, params.minPrice, "offer_price"),
    },
  ];

  const columnsStores: GridColumns<Results> = [
    {
      headerName: "Normal",
      field: "normal_price",
      renderCell: (params) => {
        const e = params.row.entities.filter(
          (entity) => entity.store === params.store.url
        );
        return storePriceText(e, params.minPrice, "normal_price");
      },
    },
    {
      headerName: "Oferta",
      field: "offer_price",
      renderCell: (params) => {
        const e = params.row.entities.filter(
          (entity) => entity.store === params.store.url
        );
        return storePriceText(e, params.minPrice, "offer_price");
      },
    },
  ];

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell align="center" colSpan={columnsIG.length}>
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
              {columnsIG.map((col, index) => (
                <StyledTableCell
                  key={`${col.headerName}-${index}`}
                  align="center"
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
              {currentStores.map((store) =>
                columnsStores.map((col) => (
                  <StyledTableCell
                    key={`${col.headerName}-${store.id}`}
                    align="center"
                  >
                    {col.headerName}
                  </StyledTableCell>
                ))
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentResult.results
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((result: Results, index: number) => {
                const minPrices = {
                  normal_price: minPriceByField(result, "normal_price"),
                  offer_price: minPriceByField(result, "offer_price"),
                };
                return (
                  <TableRow key={index}>
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
                              minPrice: minPrices[col.field],
                            })
                          : ""}
                      </StyledTableCell>
                    ))}
                    {currentStores.map((store) =>
                      columnsStores.map((col) => (
                        <StyledTableCell key={`${col.field}-${store.id}`}>
                          {col.renderCell
                            ? col.renderCell({
                                row: result,
                                store: store,
                                minPrice: minPrices[col.field],
                              })
                            : ""}
                        </StyledTableCell>
                      ))
                    )}
                  </TableRow>
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
