import { Container, Grid } from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { Category } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_CATEGORY, PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import Details from "src/sections/Details";
import { Detail } from "src/frontend-utils/types/extras";
import { getApiResourceObject } from "src/frontend-utils/redux/api_resources/apiResources";
import { Option } from "src/frontend-utils/types/extras";
import Options from "../../../sections/Options";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import { useCheckStatusCode } from "src/hooks/useCheckStatusCode";

// ----------------------------------------------------------------------

CategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

type CategoryPageProps = {
  category: Category;
  statusCode?: number;
};

// ----------------------------------------------------------------------

function CategoryPage({ category, statusCode }: CategoryPageProps) {
  useCheckStatusCode(statusCode);

  const baseRoute = `${PATH_CATEGORY.root}/${category.id}`;

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
      path: `${PATH_PRODUCT.root}?categories=${category.id}`,
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
            { name: "Categorías", href: PATH_CATEGORY.root },
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

CategoryPage.getInitialProps = async (context: MyNextPageContext) => {
  const reduxStore = context.reduxStore;
  const apiResourceObjects = reduxStore.getState().apiResourceObjects;
  const category = getApiResourceObject(
    apiResourceObjects,
    "categories",
    context.query?.id as string
  );
  if (typeof category === "undefined") {
    return {
      statusCode: 404,
    };
  } else {
    return {
      category: category,
    };
  }
};

export default CategoryPage;
