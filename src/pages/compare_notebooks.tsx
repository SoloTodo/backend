import { ReactElement } from "react";
import NextLink from "next/link";
import Layout from "src/layouts";
import Page from "src/components/Page";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { apiSettings } from "src/frontend-utils/settings";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import { fetchJson } from "src/frontend-utils/network/utils";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormCompareChart, {
  ProductsData,
} from "src/components/api_form/ApiFormCompareChart";
import { websiteId } from "src/config";
import ApiFormTreeComponent from "src/frontend-utils/api_form/fields/tree/ApiFormTreeComponent";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import { useAppSelector } from "src/frontend-utils/redux/hooks";

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
  categorySpecsFormLayout: CategorySpecsFormLayoutProps;
};

// ----------------------------------------------------------------------

const whitelist = ["brands", "lines", "processor_brands"];

function CompareNotebooks({
  fieldsMetadata,
  categorySpecsFormLayout,
}: CompareNotebooksPageProps) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const fieldFilters: JSX.Element[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    fieldset.filters.forEach((filter) => {
      if (!whitelist.includes(filter.name)) {
        return;
      }
      if (filter.name === "grocery_categories") {
        fieldFilters.push(
          <Grid key={filter.id} item xs={6}>
            <ApiFormTreeComponent name={filter.name} label={filter.label} />
          </Grid>
        );
      } else if (filter.type === "exact") {
        fieldFilters.push(
          <Grid key={filter.id} item xs={6}>
            <ApiFormSelectComponent
              name={filter.name}
              label={filter.label}
              exact
            />
          </Grid>
        );
      } else if (filter.type === "gte" || filter.type === "lte") {
        const fullName =
          filter.type === "gte" ? `${filter.name}_min` : `${filter.name}_max`;
        fieldFilters.push(
          <Grid key={filter.id} item xs={6}>
            <ApiFormSelectComponent name={fullName} label={filter.label} />
          </Grid>
        );
      } else if (filter.type === "range") {
        fieldFilters.push(
          <Grid key={filter.id} item xs={6}>
            <ApiFormSliderComponent name={filter.name} label={filter.label} />
          </Grid>
        );
      }
    });
  });

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return (
          <NextLink href={`${PATH_PRODUCT.root}/${product.id}`} passHref>
            <Link>{product.name}</Link>
          </NextLink>
        );
      },
    },
    {
      headerName: "Part Number",
      field: "part_number",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return product.specs.part_number ?? "N/A";
      },
    },
    {
      headerName: "Procesador",
      field: "processor",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return product.specs.processor_unicode;
      },
    },
    {
      headerName: "Ram",
      field: "ram",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return product.specs.ram_quantity_unicode;
      },
    },
    {
      headerName: "Storage Drive",
      field: "storage",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return product.specs.largest_storage_drive.capacity_unicode;
      },
    },
    {
      headerName: "SO",
      field: "so",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return product.specs.operating_system_short_name;
      },
    },
  ];

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
          endpoint={`${apiSettings.apiResourceEndpoints.categories}1/browse/`}
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
                    <ApiFormSelectComponent name="stores" label="Tiendas" />
                  </Grid>
                  <Grid item xs={6}>
                    <ApiFormSelectComponent
                      name="exclude_refurbished"
                      label="Condición"
                    />
                  </Grid>
                  {fieldFilters.map((f) => f)}
                  <Grid item xs={6}>
                    <ApiFormTextComponent
                      name="search"
                      label="Palabras clave"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="Gráfica" />
              <CardContent sx={{ overflow: "auto" }}>
                <ApiFormCompareChart />
              </CardContent>
            </Card>
            <ApiFormPaginationTable columns={columns} title="Productos" />
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
      fieldType: "pagination" as "pagination",
    },
    {
      fieldType: "text" as "text",
      name: "search",
    },
    {
      name: "stores",
      fieldType: "select" as "select",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "stores"),
    },
    {
      name: "exclude_refurbished",
      fieldType: "select" as "select",
      choices: [
        { value: "False", label: "Todos" },
        { value: "True", label: "Nuevos" },
      ],
    },
  ];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    fieldset.filters.forEach((filter) => {
      if (!whitelist.includes(filter.name)) {
        return;
      }
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
  });

  return {
    fieldsMetadata: fieldsMetadata,
    categorySpecsFormLayout: categorySpecsFormLayout,
  };
};

export default CompareNotebooks;
