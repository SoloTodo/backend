import { Link, Stack, Typography } from "@mui/material";
import currency from "currency.js";
import NextLink from "next/link";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { PATH_ENTITY } from "src/routes/paths";

type BrandRowData = {
  entities: Entity[];
  product: InLineProduct;
  rowIds: number[];
};

export default function SegmentRowPriceCell({
  storeUrl,
  product,
  rowData,
  comparisonProduct,
  comparisonRowData,
  priceType,
}: {
  storeUrl: string;
  product: InLineProduct | null;
  rowData?: BrandRowData[];
  comparisonProduct?: InLineProduct | null;
  comparisonRowData?: BrandRowData[];
  priceType: "offer" | "normal";
}) {
  let price = currency(0);
  let priceContainer = <p>-</p>;

  if (product && rowData) {
    const row = rowData.filter((r) => r.product.id === product.id)[0];
    const entity = row.entities.filter((e) => e.store === storeUrl)[0];

    if (entity) {
      price = currency(entity.active_registry![`${priceType}_price`], {
        precision: 0,
      });
      priceContainer = (
        <NextLink href={`${PATH_ENTITY.root}/${entity.id}`} passHref>
          <Link variant="body2">{price.format()}</Link>
        </NextLink>
      );
    }
  }

  let comparisonContainer = <p></p>;
  if (comparisonProduct && comparisonRowData) {
    const comparisonRow = comparisonRowData.filter(
      (r) => r.product.id === comparisonProduct.id
    )[0];
    const comparisonEntity = comparisonRow.entities.filter(
      (e) => e.store === storeUrl
    )[0];

    if (price && price.value !== 0 && comparisonEntity) {
      const price2 = currency(
        comparisonEntity.active_registry![`${priceType}_price`],
        {
          precision: 0,
        }
      );
      const comparison = currency(100)
        .multiply(price.subtract(price2))
        .divide(price2);
      if (comparison.value < 0) {
        comparisonContainer = (
          <Typography color="success.main" variant="caption">
            -{comparison.value.toPrecision(2)}%
          </Typography>
        );
      } else {
        comparisonContainer = (
          <Typography color="error.main" variant="caption">
            +{comparison.value.toPrecision(2)}%
          </Typography>
        );
      }
    }
  }

  return (
    <Stack direction="row" spacing={1}>
      {priceContainer}
      {comparisonContainer}
    </Stack>
  );
}
