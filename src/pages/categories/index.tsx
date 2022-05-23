import { ReactElement } from "react";
import NextLink from "next/link";
import { Card, CardContent, CardHeader, Container, Link } from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
// redux
import { useAppSelector } from "src/store/hooks";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import CustomTable from "src/sections/CustomTable";
import { PATH_CATEGORY } from "src/routes/paths";
import { GridColDef } from "@mui/x-data-grid";

// ----------------------------------------------------------------------

Categories.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Categories() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categoriesData = getApiResourceObjects(apiResourceObjects, "categories");

  const columns: GridColDef[] = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (params) => (
        <NextLink href={`${PATH_CATEGORY.root}/${params.row.id}`} passHref>
          <Link>{params.row.name}</Link>
        </NextLink>
      ),
    },
  ];

  return (
    <Page title="Categorías">
      <Container maxWidth={false}>
        <Card>
          <CardHeader title="Categorías" />
          <CardContent>
            <CustomTable columns={columns} data={categoriesData} />
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
