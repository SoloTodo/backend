import NextLink from "next/link";
import LinkIcon from "@mui/icons-material/Link";
import { Button, Link, Stack, styled } from "@mui/material";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { PATH_ENTITY, PATH_STORE } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import { Store } from "src/frontend-utils/types/store";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

const BootstrapButton = styled(Button)({
  "&:focus": {
    boxShadow: "0 0 0 0.3rem rgba(24, 144, 255, .5)",
  },
});

export default function PendingEntitiesTable() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const context = useContext(ApiFormContext);

  const handleEntityHide = (entityUrl: string) => {
    jwtFetch(null, `${entityUrl}toggle_visibility/`, { method: "POST" });
    context.setCurrentResult({
      ...context.currentResult,
      count: context.currentResult.count - 1,
      results: context.currentResult.results.filter(
        (e: { url: string }) => e.url !== entityUrl
      ),
    });
  };

  const columns: any = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: { id: string; name: string }) => (
        <NextLink href={`${PATH_ENTITY.root}/${row.id}`} passHref>
          <Link>{row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Tienda",
      field: "store",
      flex: 1,
      renderCell: (row: any) => (
        <Stack alignItems={"center"} spacing={1}>
          <NextLink
            href={`${PATH_STORE.root}/${apiResourceObjects[row.store].id}`}
            passHref
          >
            <Link>{apiResourceObjects[row.store].name}</Link>
          </NextLink>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={row.external_url}
          >
            <LinkIcon />
          </Link>
        </Stack>
      ),
    },
    {
      headerName: "País",
      field: "country",
      flex: 1,
      renderCell: (row: any) =>
        apiResourceObjects[(apiResourceObjects[row.store] as Store).country]
          .name,
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: any) => apiResourceObjects[row.category].name,
    },
    {
      headerName: "Asociar",
      field: "id",
      flex: 1,
      renderCell: (row: any) => (
        <NextLink href={`${PATH_ENTITY.root}/${row.id}/associate`} passHref>
          <BootstrapButton
            variant="contained"
            href={`${PATH_ENTITY.root}/${row.id}/associate`}
            disableRipple
          >
            Asociar
          </BootstrapButton>
        </NextLink>
      ),
    },
    {
      headerName: "Esconder",
      field: "is_visible",
      flex: 1,
      renderCell: (row: any) => (
        <Button variant="outlined" onClick={() => handleEntityHide(row.url)}>
          Esconder
        </Button>
      ),
    },
  ];

  return <ApiFormPaginationTable columns={columns} title="Entidades" />;
}
