import { ReactElement, useState } from "react";
import { GetServerSideProps } from "next/types";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import Layout from "src/layouts";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
// hooks
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_WTB } from "src/routes/paths";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import CarouselBasic from "src/sections/mui/CarouselBasic";
import Options from "src/sections/Options";
// types
import { Option } from "src/frontend-utils/types/extras";
import { Category } from "src/frontend-utils/types/store";
import { Brand, WtbEntity } from "src/frontend-utils/types/wtb";
import GeneralInformation from "src/sections/wtb/GeneralInformation";
import PricingInformation from "src/sections/wtb/PricingInformation";
import { User } from "src/frontend-utils/types/user";
import StaffInformation from "src/sections/wtb/StaffInformation";

// ----------------------------------------------------------------------

WtbEntityPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

type WtbEntityProps = {
  entity: WtbEntity;
  brand: Brand;
  users: User[];
};

// ----------------------------------------------------------------------

export default function WtbEntityPage(props: WtbEntityProps) {
  const { brand, users } = props;
  const [entity, setEntity] = useState<WtbEntity>(props.entity);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const hasStaffPermission =
    (apiResourceObjects[entity.category] as Category).permissions.includes(
      "is_category_staff"
    ) && brand.permissions.includes("is_wtb_brand_staff");
  const baseRoute = `${PATH_WTB.entities}/${entity.id}`;

  const options: Option[] = [];

  if (hasStaffPermission)
    options.push({
      key: 3,
      text: "Asociar",
      path: `${baseRoute}/associate`,
    });

  return (
    <Page title={entity.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Donde Comprar", href: PATH_WTB.entities },
            { name: "Entidades", href: PATH_WTB.entities },
            { name: entity.name },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <CardHeader title="Fotografías" />
              <CardContent>
                <CarouselBasic images={[entity.picture_url]} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Options options={options} />
          </Grid>
          <Grid item xs={12} md={6}>
            <GeneralInformation entity={entity} brand={brand} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <PricingInformation entity={entity} setEntity={setEntity} />
              <StaffInformation entity={entity} users={users} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.users_with_staff_actions
  );
  try {
    const entity = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.wtb_entities}${context.params?.id}/`
    );
    const brand = await jwtFetch(context, (entity as WtbEntity).brand);
    return {
      props: {
        entity: entity,
        brand: brand,
        users: users,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
