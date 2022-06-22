import NextLink from "next/link";
import { Button, Link, Typography } from "@mui/material";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { PATH_PRODUCT, PATH_RATING } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { Rating } from "src/frontend-utils/types/ratings";
import { useUser } from "src/frontend-utils/redux/user";
import { useSnackbar } from "notistack";

export default function PendingRatingssTable() {
  const { enqueueSnackbar } = useSnackbar();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const user = useAppSelector(useUser);
  const context = useContext(ApiFormContext);

  const handleRatingApprove = (ratingUrl: string) => {
    jwtFetch(null, `${ratingUrl}`, { method: "POST" }).then(
      (approvedRating) => {
        context.setCurrentResult({
          ...context.currentResult,
          count: context.currentResult.count - 1,
          results: context.currentResult.results.filter(
            (e: { url: string }) => e.url !== approvedRating.url
          ),
        });
        enqueueSnackbar("Rating aprobado");
      }
    );
  };

  const handleRatingDelete = (ratingUrl: string) => {
    jwtFetch(null, `${ratingUrl}`, { method: "DELETE" }).then(() => {
      context.setCurrentResult({
        ...context.currentResult,
        count: context.currentResult.count - 1,
        results: context.currentResult.results.filter(
          (e: { url: string }) => e.url !== ratingUrl
        ),
      });
      enqueueSnackbar("Rating borrado");
    });
  };

  const columns: any[] = [
    {
      headerName: "ID",
      field: "id",
      flex: 1,
      renderCell: (row: Rating) => (
        <NextLink href={`${PATH_RATING.root}/${row.id}`} passHref>
          <Link>{row.id}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      renderCell: (row: Rating) => fDateTimeSuffix(row.creation_date),
      flex: 1,
    },
    {
      headerName: "Producto",
      field: "producto",
      flex: 1,
      renderCell: (row: Rating) => (
        <NextLink href={`${PATH_PRODUCT.root}/${row.product.id}`} passHref>
          <Link>{row.product.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Rating producto",
      field: "product_rating",
      flex: 1,
    },
    {
      headerName: "Comentarios product",
      field: "product_comments",
      flex: 1,
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: Rating) => (
        <NextLink
          href={`${PATH_PRODUCT.root}/${apiResourceObjects[row.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[row.store].name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Rating tienda",
      field: "store_rating",
      flex: 1,
    },
    {
      headerName: "Comentarios tienda",
      field: "store_comments",
      flex: 1,
    },
    {
      headerName: "Prueba de compra",
      field: "purchase_proof",
      flex: 1,
      renderCell: (row: Rating) => (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={row.purchase_proof}
        >
          Descargar
        </Link>
      ),
    },
  ];

  if (user && user.permissions.includes("solotodo.is_ratings_staff")) {
    columns.push(
      {
        headerName: "IP",
        field: "ip",
        flex: 1,
        renderCell: (row: Rating) =>
          row.ip.length <= 15 ? (
            <Typography>{row.ip}</Typography>
          ) : (
            <Typography>{row.ip.substring(0, 12)}...</Typography>
          ),
      },
      {
        headerName: "Usuario",
        field: "usuario",
        flex: 1,
        renderCell: (row: Rating) => row.user.email,
      },
      {
        headerName: "Aprobar",
        field: "approve",
        flex: 1,
        renderCell: (row: Rating) => (
          <Button
            variant="contained"
            onClick={() => handleRatingApprove(row.url)}
          >
            Aprobar
          </Button>
        ),
      },
      {
        headerName: "Borrar",
        field: "delete",
        flex: 1,
        renderCell: (row: Rating) => (
          <Button
            variant="outlined"
            onClick={() => handleRatingDelete(row.url)}
          >
            Borrar
          </Button>
        ),
      }
    );
  }

  return <ApiFormPaginationTable columns={columns} title="Ratings" />;
}
