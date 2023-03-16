import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import { GetServerSideProps } from "next/types";
import { ReactElement, useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { BrandComparison } from "src/frontend-utils/types/brand_comparison";
import Layout from "src/layouts";
import { PATH_BRAND_COMPARISONS, PATH_DASHBOARD } from "src/routes/paths";
import ListAlerts from "src/sections/brand_comparisons/ListAlerts";
import ListManualProducts from "src/sections/brand_comparisons/ListManualProducts";
import ListPendingProducts from "src/sections/brand_comparisons/ListPendingProducts";
import EditBrandComparisonName from "src/sections/brand_comparisons/EditBrandComparisonName";
import BrandComparisonTable from "src/sections/brand_comparisons/BrandComparisonTable";
import SelectStores from "src/sections/brand_comparisons/SelectStores";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import AddSegmentButton from "src/sections/brand_comparisons/AddSegmentButton";
import EditPriceTypeButton from "src/sections/brand_comparisons/EditPriceTypeButton";
import DownloadReportButton from "src/sections/brand_comparisons/DownloadReportButton";
import DeleteBrandComparison from "src/sections/brand_comparisons/DeleteBrandComparison";

// ----------------------------------------------------------------------

BrandComparisonDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

type RawRowData =
  | {
      entities: Entity[];
      product: InLineProduct;
    }[]
  | null;

// ----------------------------------------------------------------------

export default function BrandComparisonDetail({
  initialbrandComparison,
}: {
  initialbrandComparison: BrandComparison;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [brandComparison, setbrandComparison] = useState(
    initialbrandComparison
  );
  const [displayStores, setDisplayStores] = useState(true);
  const [brand1RawRowData, setBrand1RowRawData] = useState<RawRowData>(null);
  const [brand2RawRowData, setBrand2RowRawData] = useState<RawRowData>(null);

  const onComparisonChange = (updateBrandComparison?: BrandComparison) => {
    if (updateBrandComparison) {
      setbrandComparison(updateBrandComparison);
    } else {
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.brand_comparisons}${initialbrandComparison.id}/`
      ).then((res) => setbrandComparison(res));
    }

    setRowData(1, updateBrandComparison);
    setRowData(2, updateBrandComparison);
  };

  const setRowData = async (
    brandIndex: 1 | 2,
    comparison?: BrandComparison
  ) => {
    comparison = comparison || initialbrandComparison;
    const otherIndex = (brandIndex % 2) + 1;
    const otherBrand =
      comparison[`brand_${otherIndex}` as "brand_1" | "brand_2"];

    const categoryId = comparison.category.id;
    const selectedStores = comparison.stores.map(
      (store_url) => apiResourceObjects[store_url].id
    );

    let endpoint = `categories/${categoryId}/full_browse/?`;

    for (const storeId of selectedStores) {
      endpoint += `stores=${storeId}&`;
    }

    const promises = [
      jwtFetch(
        null,
        endpoint + `db_brands=${comparison[`brand_${brandIndex}`].id}`
      ).then((json) => json["results"]),
    ];

    if (comparison.manual_products.length > 0) {
      let mpEndpoint = `products/available_entities/?`;

      for (const manual_product of comparison.manual_products) {
        mpEndpoint += `ids=${manual_product.id}&`;
      }

      for (const storeId of selectedStores) {
        mpEndpoint += `stores=${storeId}&`;
      }

      promises.push(
        jwtFetch(null, mpEndpoint).then((json) => {
          const extraRowData = json["results"];
          return extraRowData.filter(
            (data: any) => data.product.brand !== otherBrand.url
          );
        })
      );
    }

    const rawRowData = await Promise.all(promises).then((res) => res.flat());

    for (const segment of comparison.segments) {
      for (const row of segment.rows) {
        if (row[`product_${brandIndex}`]) {
          // Manually add the products referenced by the comparison (in case they are not avaialble)
          const result = rawRowData.filter(
            (result) => result.product.id === row[`product_${brandIndex}`]?.id
          )[0];
          if (!result) {
            rawRowData.push({
              entities: [],
              product: row[`product_${brandIndex}`],
            });
          }
        }
      }
    }
    if (brandIndex === 1) {
      setBrand1RowRawData(rawRowData);
    } else {
      setBrand2RowRawData(rawRowData);
    }
  };

  const processRowData = (rawRowData: RawRowData, brandIndex: string) => {
    const rowData = rawRowData?.map((result) => ({
      ...result,
      rowIds: [] as number[],
    }));

    for (const segment of brandComparison.segments) {
      for (const row of segment.rows) {
        if (row[`product_${brandIndex}` as "product_1" | "product_2"]) {
          const result = rowData?.filter(
            (result) =>
              result.product.id ===
              row[`product_${brandIndex}` as "product_1" | "product_2"]?.id
          )[0];
          if (result) {
            result.rowIds.push(row.id);
          }
        }
      }
    }

    return rowData;
  };

  useEffect(() => {
    setRowData(1);
    setRowData(2);
  }, []);

  const brand1RowData = processRowData(brand1RawRowData, "1");
  const brand2RowData = processRowData(brand2RawRowData, "2");

  return (
    <Page title="Comparación de marcas">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            {
              name: "Comparación de marcas",
              href: PATH_BRAND_COMPARISONS.root,
            },
            { name: brandComparison.name },
          ]}
        />
        <Stack spacing={3}>
          <Card>
            <CardHeader
              title={
                <EditBrandComparisonName
                  brandComparison={brandComparison}
                  setBrandComparison={onComparisonChange}
                />
              }
            />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item>
                  <ListAlerts brandComparison={brandComparison} />
                </Grid>
                <Grid item>
                  <ListManualProducts brandComparison={brandComparison} />
                </Grid>
                <Grid item>
                  <ListPendingProducts
                    brandComparison={brandComparison}
                    brand1RowData={brand1RowData}
                    brand2RowData={brand2RowData}
                  />
                </Grid>
                <Grid item>
                  <SelectStores
                    brandComparison={brandComparison}
                    setBrandComparison={onComparisonChange}
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => setDisplayStores(!displayStores)}
                  >
                    Ocultar tiendas
                  </Button>
                </Grid>
                <Grid item>
                  <EditPriceTypeButton
                    brandComparison={brandComparison}
                    onComparisonChange={onComparisonChange}
                  />
                </Grid>
                <Grid item>
                  <DownloadReportButton brandComparison={brandComparison} />
                </Grid>
                <Grid item>
                  <DeleteBrandComparison brandComparison={brandComparison} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <BrandComparisonTable
                  brandComparison={brandComparison}
                  displayStores={displayStores}
                  onComparisonChange={onComparisonChange}
                  brand1RowData={brand1RowData}
                  brand2RowData={brand2RowData}
                />
                <AddSegmentButton
                  brandComparison={brandComparison}
                  onComparisonChange={onComparisonChange}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const brandComparison = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.brand_comparisons}${context.params?.id}/`
    );
    return {
      props: {
        initialbrandComparison: brandComparison,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
