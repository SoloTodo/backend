import { ReactElement, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
// layout
import Layout from "src/layouts";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// types
import { EntityEvent } from "src/frontend-utils/types/entity";
// paths
import { apiSettings } from "src/frontend-utils/settings";
import { PATH_DASHBOARD, PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
// utils
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { fDateTimeSuffix } from "src/utils/formatTime";
import ReactMarkdown from "react-markdown";

// ----------------------------------------------------------------------

EntityEventPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function EntityEventPage() {
  const [isLoading, setLoading] = useState(true);
  const [entity, setEntity] = useState({
    id: "",
    name: "",
  });
  const [events, setEvents] = useState([]);
  const router = useRouter();

  useEffect(() => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/events`
    ).then((data) => {
      setEvents(data);
    });
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.entities}${router.query.id}/`
    ).then((data) => {
      setEntity(data);
      setLoading(false);
    });
  }, []);

  const fieldValueToComponent = (
    field: string,
    value: { id: number; name: string } | null | string
  ) => {
    if (
      ["category", "scraped_category", "currency", "state"].includes(field) &&
      value !== null &&
      typeof value !== "string"
    ) {
      return value.name;
    } else if (["product", "cell_plan"].includes(field)) {
      return value && value !== null && typeof value !== "string" ? (
        <NextLink href={`${PATH_PRODUCT.root}/${value.id}`} passHref>
          <Link>{value.name}</Link>
        </NextLink>
      ) : (
        <em>N/A</em>
      );
    } else if (
      ["url", "discovery_url"].includes(field) &&
      typeof value === "string"
    ) {
      return (
        <Link target="_blank" rel="noopener noreferrer" href={value}>
          {value || <em>N/A</em>}
        </Link>
      );
    } else if (field === "description" && typeof value === "string") {
      return <ReactMarkdown>{value}</ReactMarkdown>;
    } else if (field === "is_visible") {
      return value ? "Si" : "No";
    } else if (field === "picture_urls") {
      if (value) {
        return (
          <ul>
            {JSON.parse(value as any).map((pictureUrl: string) => (
              <li key={pictureUrl}>
                <a href={pictureUrl} target="_blank" rel="noopener noreferrer">
                  {pictureUrl}
                </a>
              </li>
            ))}
          </ul>
        );
      } else {
        return <em>N/A</em>;
      }
    } else if (
      field === "bundle" &&
      value !== null &&
      typeof value !== "string"
    ) {
      if (value) {
        return value.name;
      } else {
        return <em>N/A</em>;
      }
    }

    return value;
  };

  return (
    <Page title={entity.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Entidades", href: PATH_ENTITY.root },
            { name: entity.name, href: `${PATH_ENTITY.root}/${entity.id}` },
            { name: "Eventos" },
          ]}
        />
        {!isLoading ? (
          <Stack spacing={2}>
            {events.map((event: EntityEvent) => (
              <Card key={event.timestamp}>
                <CardHeader title={fDateTimeSuffix(event.timestamp)} />
                <CardContent>
                  <Typography>
                    <strong>Usuario:</strong> {event.user.full_name}
                  </Typography>
                  <br />
                  {event.changes.map((change, index) => (
                    <Grid container key={index} spacing={2}>
                      <Grid item xs={24} md={12}>
                        <strong>
                          {change.field.charAt(0).toUpperCase() +
                            change.field.slice(1)}
                        </strong>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2} style={{ wordBreak: "break-all" }}>
                          <Typography variant="subtitle1">
                            <i>Valor antiguo</i>
                          </Typography>
                          {fieldValueToComponent(
                            change.field,
                            change.old_value
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Stack spacing={2} style={{ wordBreak: "break-all" }}>
                          <Typography variant="subtitle1">
                            <i>Valor nuevo</i>
                          </Typography>
                          {fieldValueToComponent(
                            change.field,
                            change.new_value
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </Page>
  );
}
