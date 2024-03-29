import { Container, Link } from "@mui/material";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import {ReactElement, useState} from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useUser } from "src/frontend-utils/redux/user";
import { apiSettings } from "src/frontend-utils/settings";
import { Detail } from "src/frontend-utils/types/extras";
import {Rating} from "src/frontend-utils/types/ratings";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_PRODUCT, PATH_RATING, PATH_STORE } from "src/routes/paths";
import Details from "src/sections/Details";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { fDateTimeSuffix } from "src/utils/formatTime";
import RatingStatusSelector from "../../../components/RatingStatusSelector";

// ----------------------------------------------------------------------

RatingPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function RatingPage({ originalRating }: { originalRating: Rating }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const user = useAppSelector(useUser);
  const [rating, setRating] = useState<Rating>(originalRating)

  const details: Detail[] = [
    {
      key: "creation_date",
      label: "ID",
      renderData: (rating: Rating) => fDateTimeSuffix(rating.creation_date),
    },
    {
      key: "store",
      label: "Tienda",
      renderData: (rating: Rating) => (
        <NextLink
          href={`${PATH_STORE.root}/${apiResourceObjects[rating.store].id}`}
          passHref
        >
          <Link>{apiResourceObjects[rating.store].name}</Link>
        </NextLink>
      ),
    },
    {
      key: "store_rating",
      label: "Rating tienda",
    },
    {
      key: "store_comments",
      label: "Comentarios tienda",
    },
    {
      key: "product",
      label: "Producto",
      renderData: (rating: Rating) => (
        <NextLink href={`${PATH_PRODUCT.root}/${rating.product.id}`} passHref>
          <Link>{rating.product.name}</Link>
        </NextLink>
      ),
    },
    {
      key: "product_rating",
      label: "Rating producto",
      renderData: (rating: Rating) =>
        rating.product_rating || "Producto no recibido",
    },
    {
      key: "product_comments",
      label: "Comentarios producto",
      renderData: (rating: Rating) =>
        rating.product_rating
          ? rating.product_comments
          : "Producto no recibido",
    },
    {
      key: "status",
      label: "Estado",
      renderData: (rating: Rating) => <RatingStatusSelector rating={rating} setRating={rating => setRating(rating)} />,
    },
    {
      key: "last_updated",
      label: "Última actualización",
      renderData: (rating: Rating) => fDateTimeSuffix(rating.last_updated),
    },
  ];

  if (user && user.permissions.includes("solotodo.is_ratings_staff")) {
    details.push(
      {
        key: "contact",
        label: "Contacto",
        renderData: (rating: Rating) => rating.email_or_phone || <em>N/A</em>,
      },
      {
        key: "ip",
        label: "IP",
      },
      {
        key: "purchase_proof",
        label: "Prueba de compra",
        renderData: (rating: Rating) => (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={rating.purchase_proof}
          >
            Descargar
          </Link>
        ),
      }
    );
  }

  return (
    <Page title={`${rating.id} | Rating`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Ratings", href: PATH_RATING.root },
            { name: rating.id.toString() },
          ]}
        />
        <Details
          data={rating}
          details={details}
          title={`Rating #${rating.id}`}
        />
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const rating = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.ratings}${context.params?.id}/`
    );
    return {
      props: {
        originalRating: rating,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
