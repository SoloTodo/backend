import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import { NextPageContext } from "next/types";
import { ReactElement } from "react";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import { getCategorySpecsFromLayout } from "src/frontend-utils/nextjs/utils";
import {
  getApiResourceObject,
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { CategorySpecsFormLayoutProps } from "src/frontend-utils/types/store";
import Layout from "src/layouts";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import { PATH_CATEGORY, PATH_DASHBOARD } from "src/routes/paths";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import CategoryShareOfshelvesChart from "src/sections/categories/CategoryShareOfShelvesChart";
import CategoryShareOfShelvesTable from "src/sections/categories/CategoryShareOfShelvesTable";
import CategoryShareOfShelvesReportButton from "src/sections/categories/CategoryShareOfShelvesReportButton";

// ----------------------------------------------------------------------

CategoryShareOfShelves.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CategoryShareOfShelves({
  categorySpecsFormLayout,
}: {
  categorySpecsFormLayout: CategorySpecsFormLayoutProps;
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
      name: "store_types",
      multiple: true,
      choices: selectApiResourceObjects(apiResourceObjects, "store_types"),
    },
    {
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  const filterComponents: JSX.Element[] = [];
  const allFieldSets: { label: string; value: string }[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    const fieldFilters: JSX.Element[] = [];
    fieldset.filters.forEach((filter) => {
      allFieldSets.push({
        label: filter.label,
        value: filter.name,
      });
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
            <ApiFormSelectComponent
              name={filter.name}
              label={filter.label}
              exact
            />
          </AccordionDetails>
        );
      } else if (filter.type === "gte" || filter.type === "lte") {
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

  allFieldSets.length !== 0 &&
    fieldsMetadata.push({
      fieldType: "select" as "select",
      name: "bucketing_field",
      multiple: false,
      required: true,
      choices: allFieldSets,
    });

  return (
    <Page title={`${category.name} | Share of shelves`}>
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
            { name: "Share of shelves" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${category.url}share_of_shelves/`}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card>
                <CardHeader title="Parámetros" />
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
                      <ApiFormSelectComponent
                        name="store_types"
                        label="Tipos"
                      />
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
                <CardHeader
                  title="Participación"
                  action={<CategoryShareOfShelvesReportButton />}
                />
                <CardContent>
                  <Stack spacing={3}>
                    {allFieldSets.length !== 0 && (
                      <ApiFormSelectComponent
                        name="bucketing_field"
                        label="Agrupar por"
                      />
                    )}
                    <CategoryShareOfshelvesChart />
                    <CategoryShareOfShelvesTable />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps = async (context: NextPageContext) => {
  return await getCategorySpecsFromLayout(context);
};
