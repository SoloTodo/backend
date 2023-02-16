import { ReactElement } from "react";
import Layout from "src/layouts";
import Page from "src/components/Page";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "src/routes/paths";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { apiSettings } from "src/frontend-utils/settings";
import { selectApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import { fetchJson } from "src/frontend-utils/network/utils";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormCompareChart from "src/components/api_form/ApiFormCompareChart";
import { websiteId } from "src/config";

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

CompareNotebooks.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

type CompareNotebooksPageProps = {
  fieldsMetadata: ApiFormFieldMetadata[];
  processorsLines: { id: number; name: string }[];
};

// ----------------------------------------------------------------------

function CompareNotebooks({
  fieldsMetadata,
  processorsLines,
}: CompareNotebooksPageProps) {
  return (
    <Page title="Comparar Notebooks">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Comparar Notebooks" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.categories}1/browse/?exclude_refurbished=True`}
        >
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Filtros" />
              <CardContent>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 6, md: 12 }}
                >
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="ordering"
                      label="Ordenar por"
                      selectOnly
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="stores" label="Tiendas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="brands" label="Marcas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent name="lines" label="Líneas" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Gráfica" />
              <CardContent sx={{ overflow: "auto" }}>
                <ApiFormCompareChart processorsLines={processorsLines} />
              </CardContent>
            </Card>
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

CompareNotebooks.getInitialProps = async (context: MyNextPageContext) => {
  const reduxStore = context.reduxStore;
  const apiResourceObjects = reduxStore.getState().apiResourceObjects;

  const response = await fetchJson(
    `${apiSettings.apiResourceEndpoints.category_specs_form_layouts}?category=1`
  );
  let categorySpecsFormLayout: CategorySpecsFormLayoutProps = response[0];
  response.forEach((res: CategorySpecsFormLayoutProps) => {
    if (
      res.website == `${apiSettings.apiResourceEndpoints.websites}${websiteId}/`
    )
      categorySpecsFormLayout = res;
  });

  const fieldsMetadata: ApiFormFieldMetadata[] = [
    {
      name: "stores",
      fieldType: "select" as "select",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      fieldType: "select" as "select",
      name: "ordering",
      choices: [
        {
          value: "offer_price_usd",
          label: "Precio",
        },
        {
          value: "leads",
          label: "Popularidad",
        },
        {
          value: "discount",
          label: "Descuento",
        },
        ...categorySpecsFormLayout.orders.reduce((acc, o) => {
          if (o.suggested_use === "ascending") {
            acc.push({
              value: o.name,
              label: o.label,
            });
          } else if (o.suggested_use === "descending") {
            acc.push({
              value: `-${o.name}`,
              label: o.label,
            });
          } else if (o.suggested_use === "both") {
            acc.push({
              value: o.name,
              label: `${o.label} (menor a mayor)`,
            });
            acc.push({
              value: `-${o.name}`,
              label: `${o.label} (mayor a menor)`,
            });
          }
          return acc;
        }, []),
      ],
    },
  ];

  categorySpecsFormLayout.fieldsets[0].filters.forEach((filter) => {
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
    if (filter.name === "grocery_categories") {
      fieldsMetadata.push({
        fieldType: "tree" as "tree",
        name: filter.name,
        multiple: false,
        choices: filterChoices,
      });
    } else if (filter.type === "exact") {
      fieldsMetadata.push({
        fieldType: "select" as "select",
        name: filter.name,
        multiple: Boolean(filter.choices),
        choices: filterChoices,
      });
    } else if (filter.type === "gte" || filter.type === "lte") {
      const fullName =
        filter.type === "gte" ? `${filter.name}_min` : `${filter.name}_max`;
      fieldsMetadata.push({
        fieldType: "select" as "select",
        name: fullName,
        multiple: false,
        choices: filterChoices,
      });
    } else if (filter.type === "range") {
      if (
        filter.continuous_range_step !== null &&
        filter.continuous_range_unit !== null
      ) {
        fieldsMetadata.push({
          fieldType: "slider" as "slider",
          name: filter.name,
          step: filter.continuous_range_step,
          unit: filter.continuous_range_unit,
          choices: [],
        });
      } else {
        fieldsMetadata.push({
          fieldType: "slider" as "slider",
          name: filter.name,
          step: null,
          unit: null,
          choices: filterChoices.map((c) => ({ ...c, index: c.value })),
        });
      }
    }
  });

  const processorLines =
    categorySpecsFormLayout.fieldsets[1].filters[1].choices;

  return {
    fieldsMetadata: fieldsMetadata,
    processorsLines: processorLines,
  };
};

export default CompareNotebooks;
