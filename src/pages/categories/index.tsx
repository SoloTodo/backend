import { ReactElement } from "react";
import { Container } from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import BasicTable from "src/sections/BasicTable";
// redux
import { useAppSelector } from "src/store/hooks";
import { apiResourceObjectsByIdOrUrl, useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

// ----------------------------------------------------------------------

Categories.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Categories() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categoriesData = Object.values(apiResourceObjectsByIdOrUrl(apiResourceObjects, "categories", "url"))

  const columns = [
    {
      headerName: "Id",
      field: "id",
      flex: 1,
    },
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
    },
  ];

  return (
    <Page title="Categorías">
      <Container>
        <BasicTable
          title="Categorías"
          columns={columns}
          data={categoriesData}
        />
      </Container>
    </Page>
  );
}

