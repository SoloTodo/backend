import { Container, Link, Stack } from "@mui/material";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { apiSettings } from "src/frontend-utils/settings";
import { Brand } from "src/frontend-utils/types/banner";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import Layout from "src/layouts";
import { PATH_BRAND_COMPARISONS, PATH_DASHBOARD } from "src/routes/paths";
import AddBrandComparison from "src/sections/brand_comparisons/AddBrandComparison";

// ----------------------------------------------------------------------

BrandComparisons.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function BrandComparisons({brands}: {brands: Brand[]}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  
  const fieldsMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  const columns: any[] = [
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: BrandComparison) => (
        <NextLink href={`${PATH_BRAND_COMPARISONS.root}/${row.id}`} passHref>
          <Link>{row.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: BrandComparison) => apiResourceObjects[row.category].name,
    },
    {
      headerName: "Marca 1",
      field: "brand_1",
      flex: 1,
      renderCell: (row: BrandComparison) => row.brand_1.name,
    },
    {
      headerName: "Marca 2",
      field: "brand_2",
      flex: 1,
      renderCell: (row: BrandComparison) => row.brand_2.name,
    },
  ];

  return (
    <Page title="Comparación de marcas">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Comparación de marcas" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldsMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.brand_comparisons}`}
        >
          <Stack spacing={3}>
            <AddBrandComparison brands={brands} />
            <ApiFormPaginationTable
              columns={columns}
              title="Comparaciones de Marcas"
            />
          </Stack>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.brands
  );
  return {
    props: {
      brands: brands,
    },
  };
};

