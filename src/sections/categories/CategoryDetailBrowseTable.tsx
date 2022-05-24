import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import NextLink from "next/link";
import { GridColumns, GridRenderCellParams } from "@mui/x-data-grid";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { useAppSelector } from "src/store/hooks";
import { PATH_PRODUCT } from "src/routes/paths";
// import ReactTable from "react-table";

type Results = {
  cell_plan: InLineProduct | null;
  entites: Entity[];
  product: Product;
};

export default function CategoryDetailBrowseTable() {
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
      // renderCell: (params) => brands[params.row.product.brand].name,
    },
  ];

  const columnsMin: GridColumns<Results> = [
    {
      headerName: "Normal",
      field: "min_normal",
    },
    {
      headerName: "Oferta",
      field: "min_oferta",
    },
  ];

  const columnsStores: GridColumns<Results> = [
    {
      headerName: "Normal",
      field: "min_normal",
    },
    {
      headerName: "Oferta",
      field: "min_oferta",
    },
  ];

  return (
  <Paper sx={{ width: "100%", overflow: "hidden" }}>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={columnsIG.length}>
              Información General
            </TableCell>
            <TableCell align="center" colSpan={2}>
              Mínimos
            </TableCell>
            {currentStores.map((store) => (
              <TableCell align="center" colSpan={2} key={store.id}>
                {store.name}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {columnsIG.map((col, index) => (
              <TableCell key={`${col.headerName}-${index}`}>
                {col.headerName}
              </TableCell>
            ))}
            {columnsMin.map((col, index) => (
              <TableCell key={`${col.headerName}-${index}`}>
                {col.headerName}
              </TableCell>
            ))}
            {currentStores.map((store) =>
              columnsStores.map((col) => (
                <TableCell key={`${col.headerName}-${store.id}`}>
                  {col.headerName}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentResult.results.map((result: Results) => (
            <TableRow key={result.product.id}>
              <TableCell>
                {columnsIG.map((col) => (
                  <TableCell key={col.field}>
                    {col.renderCell
                      ? col.renderCell({
                          row: result,
                        } as GridRenderCellParams<any, any, any>)
                      : ""}
                  </TableCell>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
  );
}
