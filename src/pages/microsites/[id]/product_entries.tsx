import {
  Autocomplete,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_MICROSITE } from "src/routes/paths";
import { ReactElement, useState } from "react";
import Layout from "src/layouts";
import { Entry, Microsite } from "src/frontend-utils/types/microsite";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { ApiFormSelectChoice } from "src/frontend-utils/api_form/fields/select/ApiFormSelect";
import MicrositesTable from "src/sections/microsites/MicrositesTable";
import { useSnackbar } from "notistack";
import AddProductButton from "src/sections/microsites/AddProductButton";

// ----------------------------------------------------------------------

MicrositeProductEntries.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MicrositeProductEntries({
  microsite,
}: {
  microsite: Microsite;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = selectApiResourceObjects(apiResourceObjects, "categories");
  const [category, setCategory] = useState<ApiFormSelectChoice | null>(null);
  const [allEntries, setAllEntries] = useState<Entry[]>(microsite.entries);
  const [entries, setEntries] = useState<Entry[]>(microsite.entries);

  function handleChange(newValue: ApiFormSelectChoice | null) {
    setCategory(newValue);
    if (newValue) {
      setEntries(
        allEntries.filter(
          (e) =>
            e.product.category ===
            `${apiSettings.endpoint}categories/${newValue.value}/`
        )
      );
    } else {
      setEntries(allEntries);
    }
  }

  const isOptionEqualToValue = (
    option: ApiFormSelectChoice,
    value: ApiFormSelectChoice
  ) => {
    return option.value === value.value;
  };

  const handleDeleteEntry = async (entry: Entry) => {
    await jwtFetch(null, entry.url, { method: "DELETE" });
    setEntries(entries.filter((e) => e.id !== entry.id));
    setAllEntries(allEntries.filter((e) => e.id !== entry.id));
    enqueueSnackbar("Producto eliminado exitosamente");
    return;
  };

  const addProduct = (updatedMicrosite: Microsite) => {
    if (category) {
      setEntries(
        updatedMicrosite.entries.filter(
          (e) =>
            e.product.category ===
            `${apiSettings.endpoint}categories/${category.value}/`
        )
      );
    } else {
      setEntries(updatedMicrosite.entries);
    }
    setAllEntries(updatedMicrosite.entries);
  };

  return (
    <Page title={`${microsite.name} | Productos`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Sitios", href: PATH_MICROSITE.root },
            {
              name: microsite.name,
              href: `${PATH_MICROSITE.root}/${microsite.id}`,
            },
            { name: "Productos" },
          ]}
        />
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Filtros" />
            <CardContent>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 6, md: 12 }}
              >
                <Grid item xs={6}>
                  <Autocomplete
                    options={categories}
                    renderInput={(params) => (
                      <TextField {...params} label="Categoría" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.value}>
                        {option.label}
                      </li>
                    )}
                    filterSelectedOptions
                    onChange={(_evt, newValues) => handleChange(newValues)}
                    value={category}
                    isOptionEqualToValue={isOptionEqualToValue}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title={microsite.name}
              action={
                <AddProductButton
                  addProduct={addProduct}
                  microsite={microsite}
                />
              }
            />
            <CardContent>
              <MicrositesTable
                entries={entries}
                handleDeleteEntry={handleDeleteEntry}
                fields={microsite.fields}
              />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const microsite = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.microsite_brands}${context.params?.id}`
  );
  return {
    props: {
      microsite: microsite,
    },
  };
};
