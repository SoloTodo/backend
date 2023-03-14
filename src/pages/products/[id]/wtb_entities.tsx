import { Container, Link } from "@mui/material";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Product } from "src/frontend-utils/types/product";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_PRODUCT, PATH_WTB } from "src/routes/paths";
import PaginationTable from "src/components/api_form/ApiFormPaginationTable";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { fDateTimeSuffix } from "src/utils/formatTime";
import { Brand, WtbEntity } from "src/frontend-utils/types/wtb";

// ----------------------------------------------------------------------

ProductWtbEntities.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProductWtbEntities({ product, brands }: { product: Product, brands: Brand[] }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
      name: "wtb_entities",
    },
  ];

  const columns: any[] = [
    {
      headerName: "ID",
      field: "id",
      flex: 1,
      renderCell: (row: WtbEntity) => (
        <NextLink href={`${PATH_WTB.entities}/${row.id}`} passHref>
          <Link>{row.product.name}</Link>
        </NextLink>
      ),
    },
    {
      headerName: "Llave",
      field: "key",
      flex: 1,
    },
    {
      headerName: "Nombre",
      field: "name",
      flex: 1,
      renderCell: (row: WtbEntity) => (
        <Link target="_blank" rel="noopener noreferrer" href={row.external_url}>
          {row.name}
        </Link>
      ),
    },
    {
      headerName: "Categoría",
      field: "category",
      flex: 1,
      renderCell: (row: WtbEntity) => apiResourceObjects[row.category].name,
    },
    {
      headerName: "Marca",
      field: "brand",
      flex: 1,
      renderCell: (row: WtbEntity) => (
        brands.find((b) => b.url == row.brand.url)?.name
      ),
    },
    {
      headerName: "¿Visible?",
      field: "is_visible",
      flex: 1,
      renderCell: (row: WtbEntity) =>
        row.is_visible ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "¿Activo?",
      field: "is_active",
      flex: 1,
      renderCell: (row: WtbEntity) =>
        row.is_active ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Fecha creación",
      field: "creation_date",
      flex: 1,
      renderCell: (row: WtbEntity) => fDateTimeSuffix(row.last_updated),
    },
    {
      headerName: "Última actualización",
      field: "last_updated",
      flex: 1,
      renderCell: (row: WtbEntity) => fDateTimeSuffix(row.last_updated),
    },
  ];

  return (
    <Page title={`${product.name} | Enitidades WTB`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Productos", href: PATH_PRODUCT.root },
            { name: product.name, href: `${PATH_PRODUCT.root}/${product.id}` },
            { name: "Enitidades WTB" },
          ]}
        />
        <ApiFormComponent
          fieldsMetadata={fieldMetadata}
          endpoint={`${apiSettings.apiResourceEndpoints.wtb_entities}?products=${product.id}`}
        >
          <PaginationTable title="Entidades" columns={columns} />
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const product = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.products}${context.params?.id}`
    );
    const brands = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.wtb_brands}`
    )
    return {
      props: {
        product: product,
        brands: brands
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
