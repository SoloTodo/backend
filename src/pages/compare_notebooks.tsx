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
  Typography,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import { PATH_DASHBOARD, PATH_PRODUCT } from "src/routes/paths";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import { apiSettings } from "src/frontend-utils/settings";
import { selectApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import { fetchJson } from "src/frontend-utils/network/utils";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormCompareChart, {
  ProductsData,
} from "src/components/api_form/ApiFormCompareChart";
import ApiFormTreeComponent from "src/frontend-utils/api_form/fields/tree/ApiFormTreeComponent";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import currency from "currency.js";

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

function CompareNotebooks({
  fieldsMetadata,
  categorySpecsFormLayout,
}: CompareNotebooksPageProps) {
  const fieldFilters: JSX.Element[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    fieldset.filters.forEach((filter) => {
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
        return (
          <Typography noWrap>{product.specs.ram_quantity_unicode}</Typography>
        );
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
    {
      headerName: "Tamaño pantalla",
      field: "resolution",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const product = row.product_entries[0].product;
        return (
          <Typography noWrap>
            {`${product.specs.screen_size_family_unicode} (${product.specs.screen_resolution_unicode})`}
          </Typography>
        );
      },
    },
    {
      headerName: "Precio oferta",
      field: "offer_price",
      flex: 1,
      renderCell: (row: ProductsData) => {
        const metadata = row.product_entries[0].metadata;
        const priceCurrency = metadata.prices_per_currency.find((p) =>
          p.currency.includes(`/${apiSettings.clpCurrencyId}/`)
        );
        const offerPrice = priceCurrency
          ? parseFloat(priceCurrency.offer_price)
          : 0;
        return currency(offerPrice, {
          precision: 0,
        }).format();
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
          endpoint={`${apiSettings.apiResourceEndpoints.categories}1/browse/?exclude_marketplace=1&exclude_without_part_number=1`}
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
                      name="lenovo_store_tiers"
                      label="Tiers"
                    />
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
              <CardContent>
                <ApiFormCompareChart />
              </CardContent>
            </Card>
            <ApiFormPaginationTable
              columns={columns}
              title="Productos"
              rowsPerPage={[5, 10, 20, 50]}
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

CompareNotebooks.getInitialProps = async (context: MyNextPageContext) => {
  if (
    context.req &&
    context.query.page_size &&
    Number(context.query.page_size) > 50
  ) {
    const query = context.query;
    delete query.category_slug;
    delete query.page_size;
    delete query.page;
    let queryUrl = "";
    for (const q of Object.keys(query)) {
      if (Array.isArray(query[q])) {
        (query[q] as string[]).map((v: string) => {
          queryUrl += `${q}=${v}&`;
        });
      } else {
        queryUrl += `${q}=${query[q]}&`;
      }
    }
    queryUrl += "page_size=20";

    context.res?.writeHead(302, {
      Location: `/compare_notebooks?${queryUrl}`,
    });
    context.res?.end();
    return;
  }

  const reduxStore = context.reduxStore;
  const apiResourceObjects = reduxStore.getState().apiResourceObjects;

  let categorySpecsFormLayout: CategorySpecsFormLayoutProps = await fetchJson(
    `${apiSettings.apiResourceEndpoints.category_specs_form_layouts}370/`
  );

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
    {
      name: "lenovo_store_tiers",
      fieldType: "select" as "select",
      choices: [
        { value: "A", label: "Retail A" },
        { value: "B", label: "Retail B" },
      ],
    },
  ];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
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
