import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
} from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PATH_CATEGORY, PATH_DASHBOARD } from "src/routes/paths";
import {
  getApiResourceObject,
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/store/hooks";
import { useRouter } from "next/router";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { GetServerSideProps } from "next/types";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import CategoryDetailBrowseTable from "src/sections/categories/CategoryDetailBrowseTable";
import { Brand } from "src/frontend-utils/types/banner";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";

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
  brands,
}: {
  categorySpecsFormLayout: CategorySpecsFormLayoutProps;
  brands: Brand[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const router = useRouter();
  const categoryId = router.query.id as string;
  const category = getApiResourceObject(
    apiResourceObjects,
    "categories",
    categoryId
  );

  const fieldsMetadata: ApiFormFieldMetadata[] = [
    {
      fieldType: "select" as "select",
      name: "stores",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "countries",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "countries"),
    },
    {
      fieldType: "select" as "select",
      name: "types",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "types"),
    },
    {
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  const filterComponents: JSX.Element[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    const fieldFilters: JSX.Element[] = [];
    fieldset.filters.forEach((filter) => {
      let filterChoices =
        filter.choices === null
          ? filter.choices
          : filter.choices.map((c) => ({
              label: c.name,
              value: c.id,
            }));

      if (filter.type === "exact") {
        filterChoices = filterChoices || [
          { value: 0, label: "No" },
          { value: 1, label: "Sí" },
        ];
      } else {
        filterChoices = filterChoices || [];
      }

      if (filter.type === "exact") {
        fieldsMetadata.push({
          fieldType: "select" as "select",
          name: filter.name,
          multiple: Boolean(filter.choices),
          choices: filterChoices,
        });
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSelectComponent name={filter.name} label={filter.label} />
          </AccordionDetails>
        );
      } else if (filter.type === "gte" || filter.type === "lte") {
        // TODO: probar con start y end
        const fullName =
          filter.type === "gte" ? `${filter.name}_min` : `${filter.name}_max`;
        fieldsMetadata.push({
          fieldType: "select" as "select",
          name: fullName,
          multiple: false,
          choices: filterChoices,
        });
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSelectComponent name={fullName} label={filter.label} />
          </AccordionDetails>
        );
      } else if (filter.type === "range") {
        fieldsMetadata.push({
          fieldType: "slider" as "slider",
          name: filter.name,
          step: filter.continuous_range_step,
          unit: filter.continuous_range_unit,
          discrete: filter.choices !== null,
          choices: filterChoices,
        });
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSliderComponent name={filter.name} label={filter.label} />
          </AccordionDetails>
        );
      }
    });
    filterComponents.push(
      <Grid item xs={12} key={fieldset.label}>
        <Accordion>
          <AccordionSummary
            id={fieldset.label}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
          >
            {fieldset.label}
          </AccordionSummary>
          {fieldFilters.map((f) => f)}
        </Accordion>
      </Grid>
    );
  });

  return (
    <Page title={`${category.name} | Navegar`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Categorías", href: PATH_CATEGORY.root },
            {
              name: `${category.name}`,
              href: `${PATH_CATEGORY.root}/${category.id}`,
            },
            { name: "Navegar" },
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
                      <ApiFormSelectComponent name="stores" label="Tiendas" />
                    </Grid>
                    <Grid item xs={6}>
                      <ApiFormSelectComponent name="countries" label="Países" />
                    </Grid>
                    <Grid item xs={6}>
                      <ApiFormSelectComponent name="types" label="Tipos" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card style={{ overflow: "visible" }}>
                <CardHeader title="Filtros" />
                <CardContent>
                  <Grid container spacing={{ xs: 2, md: 3 }}>
                    <Grid item xs={12}>
                      <ApiFormTextComponent
                        name="search"
                        label="Palabras clave"
                      />
                    </Grid>
                    {filterComponents.map((f) => f)}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Resultados" />
                <CardContent>
                  <CategoryDetailBrowseTable brands={brands} />
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
  try {
    const response = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.category_specs_form_layouts}?category=${context.params?.id}`
    );
    categorySpecsFormLayout = response[0];
    response.forEach((res: { website: string }) => {
      if (res.website == "http://localhost:8000/websites/1/")
        categorySpecsFormLayout = res;
    });
    const brands = await jwtFetch(
      context,
      apiSettings.apiResourceEndpoints.brands
    );
    return {
      props: {
        categorySpecsFormLayout: categorySpecsFormLayout,
        brands: brands,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
