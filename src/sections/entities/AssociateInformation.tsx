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
import { Entity } from "src/frontend-utils/types/entity";
import { Category } from "src/frontend-utils/types/store";
// components
import CategorySelect from "src/components/my_components/CategorySelect";
import ConditionSelect from "src/components/my_components/ConditionSelect";
import VisibilitySwitch from "src/components/my_components/VisibilitySwitch";
// paths
import { PATH_PRODUCT } from "src/routes/paths";

// ----------------------------------------------------------------------

AssociateInformation.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function AssociateInformation({
  entity,
  setEntity
}: {
  entity: Entity;
  setEntity: Function;
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
            <Typography variant="h6">Condición</Typography>
            <ConditionSelect
              entity={entity}
              hasStaffPermission={hasStaffPermission}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Tienda</Typography>
            <Typography>{apiResourceObjects[entity.store].name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Categoría</Typography>
            <CategorySelect
              entity={entity}
              setEntity={setEntity}
              hasStaffPermission={hasStaffPermission}
            />
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
            <Typography variant="h6">¿Visible?</Typography>
            <VisibilitySwitch
              entity={entity}
              hasStaffPermission={hasStaffPermission}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Plan celular actual</Typography>
            <Typography>
              {entity.cell_plan ? (
                <NextLink
                  href={`${PATH_PRODUCT.root}/${entity.cell_plan.id}`}
                  passHref
                >
                  <Link>{entity.cell_plan.name}</Link>
                </NextLink>
              ) : (
                "N/A"
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}></Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Bundle actual</Typography>
            <Typography>{entity.bundle ? entity.bundle.name : "N/A"}</Typography>
          </Grid>
          {entity.cell_plan_name && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Nombre plan celular</Typography>
              <Typography>{entity.cell_plan_name}</Typography>
            </Grid>
          )}
          {entity.seller && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Vendedor</Typography>
              <Typography>{entity.seller}</Typography>
            </Grid>
          )}
          {entity.part_number && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Part number</Typography>
              <Typography>{entity.part_number}</Typography>
            </Grid>
          )}
          {entity.ean && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6">EAN</Typography>
              <Typography>{entity.ean}</Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
