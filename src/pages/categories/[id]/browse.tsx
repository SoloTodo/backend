import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { Category } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import { PATH_CATEGORY, PATH_DASHBOARD } from "src/routes/paths";
import {
  apiResourceObjectsByIdOrUrl,
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { useRouter } from "next/router";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { Masonry } from "@mui/lab";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { GetServerSideProps } from "next/types";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";

// ----------------------------------------------------------------------

type filter = {
  choices: {
    id: number;
    name: string;
    value: string | null;
  }[];
  continuous_range_step: string | null;
  continuous_range_unit: string | null;
  country: string | null;
  id: number;
  label: string;
  name: string;
  type: string;
};

type CategorySpecsFormLayoutProps = {
  category: string;
  fieldsets: {
    id: number;
    label: string;
    filters: filter[];
  }[];
  id: number;
  name: string | null;
  orders: any[];
  url: string;
  website: string;
};

// ----------------------------------------------------------------------

CategoryBrowse.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CategoryBrowse({
  categorySpecsFormLayout,
}: {
  categorySpecsFormLayout: CategorySpecsFormLayoutProps;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const router = useRouter();
  const categoryId = router.query.id as string;
  const category = (
    apiResourceObjectsByIdOrUrl(apiResourceObjects, "categories", "id") as {
      [id: string]: Category;
    }
  )[categoryId];

  console.log(categorySpecsFormLayout);

  const fieldsMetadata = [
    {
      fieldType: "select" as "select",
      name: "stores",
      label: "Tiendas",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      label: "Países",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "types",
      label: "Tipos",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "types"),
    },
    {
      fieldType: "text" as "text",
      name: "search",
      label: "Palabras clave",
      inputType: "text" as "text",
    },
  ];

  const filterComponents: JSX.Element[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    fieldset.filters.forEach((filter) => {
      console.log(filter.name);

      const filterChoices = filter.choices.map((c) => ({
        label: c.name,
        value: c.id,
      }));

      // TODO: sub filter choices according to selected ones

      if (filter.type === "exact") {
        fieldsMetadata.push({
          fieldType: "select" as "select",
          name: filter.name,
          label: filter.label,
          multiple: true,
          choices: filterChoices,
        });
        filterComponents.push(
          <Grid item xs={12} key={filter.name}>
            <ApiFormSelectComponent name={filter.name} />
          </Grid>
        );
      } else if (filter.type === "gte" || filter.type === "lte") {
        fieldsMetadata.push({
          fieldType: "select" as "select",
          name: filter.name,
          label: filter.label,
          multiple: false,
          choices: filterChoices,
        });
        filterComponents.push(
          <Grid item xs={12} key={filter.name}>
            <ApiFormSelectComponent name={filter.name} />
          </Grid>
        );
      } // TODO: range and else
    });
  });

  return (
    <Page title={`${category.name}`}>
      <Container>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_CATEGORY.root },
            { name: `${category.name}` },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${category.url}full_browse/`}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card>
                <CardHeader title="Parámetros pricing" />
                <CardContent>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 6, lg: 12 }}
                  >
                    <Grid item xs={6}>
                      <ApiFormSelectComponent name="stores" />
                    </Grid>
                    <Grid item xs={6}>
                      <ApiFormSelectComponent name="countries" />
                    </Grid>
                    <Grid item xs={6}>
                      <ApiFormSelectComponent name="types" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeader title="Filtros" />
                <CardContent>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12}>
                      <ApiFormTextComponent name="search" />
                    </Grid>
                    {filterComponents.map((f) => f)}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let categorySpecsFormLayout = {};
  if (context.params) {
    try {
      const response = await jwtFetch(
        context,
        `${apiSettings.apiResourceEndpoints.category_specs_form_layouts}?category=${context.params.id}`
      );
      response.forEach((res: { website: string }) => {
        if (res.website == "http://localhost:8000/websites/1/")
          categorySpecsFormLayout = res;
      });
    } catch {
      return {
        notFound: true,
      };
    }
  }
  return {
    props: {
      categorySpecsFormLayout: categorySpecsFormLayout,
    },
  };
};
