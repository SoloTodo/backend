import { Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { Category } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_CATEGORY, PATH_DASHBOARD } from "src/routes/paths";
import Details from "src/sections/Details";
import { Detail } from "src/frontend-utils/types/extras";
import {
  getApiResourceObject,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { useRouter } from "next/router";
import { Option } from "src/frontend-utils/types/extras";
import Options from "../../../sections/Options";

// ----------------------------------------------------------------------

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CategoryPage() {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const router = useRouter();
  const categoryId = router.query.id as string;
  const baseRoute = `${PATH_CATEGORY.root}/${categoryId}`;
  const category = getApiResourceObject(apiResourceObjects, "categories", categoryId) as Category;

  const details: Detail[] = [
    {
      key: "name",
      label: "Nombre",
    },
  ];

  const options: Option[] = [
    {
      text: "Información general",
      path: baseRoute,
      hasPermission: category.permissions.includes("view_category"),
    },
    {
      text: "Navegar",
      path: `${baseRoute}/browse`,
      hasPermission: category.permissions.includes("view_category"),
    },
    {
      text: "Productos",
      path: `${baseRoute}/products`,
      hasPermission: category.permissions.includes("view_category"),
    },
  ];

  return (
    <Page title={`${category.name}`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_CATEGORY.root },
            { name: `${category.name}` },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Details title={category.name} data={category} details={details} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} defaultKey="text" />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
