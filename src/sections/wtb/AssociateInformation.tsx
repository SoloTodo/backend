import { ReactElement } from "react";
import NextLink from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import Layout from "src/layouts";
// hooks
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// types
import { Category } from "src/frontend-utils/types/store";
import { Brand, WtbEntity } from "src/frontend-utils/types/wtb";
// components
import CategorySelect from "src/components/my_components/CategorySelect";
// paths
import { PATH_PRODUCT } from "src/routes/paths";

// ----------------------------------------------------------------------

AssociateInformation.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AssociateInformation({
  entity,
  brand
}: {
  entity: WtbEntity;
  brand: Brand;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const hasStaffPermission = (
    apiResourceObjects[entity.category] as Category
  ).permissions.includes("is_category_staff");

  return (
    <Card>
      <CardHeader title="Información" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Nombre</Typography>
            <Typography>{entity.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Categoría</Typography>
            <CategorySelect
              entity={entity}
              hasStaffPermission={hasStaffPermission}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Marca</Typography>
            <Typography>{brand.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Producto actual</Typography>
            <Typography>
              {entity.product ? (
                <NextLink
                  href={`${PATH_PRODUCT.root}/${entity.product.id}`}
                  passHref
                >
                  <Link>{entity.product.name}</Link>
                </NextLink>
              ) : (
                "N/A"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">URL</Typography>
            <Typography>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={entity.external_url}
              >
                {entity.external_url}
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
