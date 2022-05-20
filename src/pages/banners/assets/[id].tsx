import { Card, CardContent, CardHeader, Container, Stack } from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Image from "src/components/Image";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Banner, BannerAsset } from "src/frontend-utils/types/banner";
import { InLineProduct } from "src/frontend-utils/types/entity";
import Layout from "src/layouts";
import { PATH_BANNERS, PATH_DASHBOARD } from "src/routes/paths";
import AssetBannersTable from "src/sections/banners/AssetBannersTable";
import AssetContents from "src/sections/banners/AssetContents";

// ----------------------------------------------------------------------

Asset.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function Asset({
  asset,
  brands,
}: {
  asset: BannerAsset;
  brands: InLineProduct[];
}) {
  return (
    <Page title={`${asset.id} | Banner assets`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Banner assets", href: PATH_BANNERS.assets },
            { name: asset.id.toString() },
          ]}
        />
        <Stack spacing={3}>
          <Card>
            <CardHeader title="Banner" />
            <CardContent>
              <Image src={asset.picture_url} />
            </CardContent>
          </Card>
          <AssetContents asset={asset} brands={brands} />
          <AssetBannersTable assetId={asset.id.toString()} />
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const asset = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.banner_assets}${context.params?.id}/`
  );
  const brands = await jwtFetch(
    context,
    apiSettings.apiResourceEndpoints.brands
  );
  return {
    props: {
      asset: asset,
      brands: brands,
    },
  };
};
