import { Card, CardContent, CardHeader, Container, Link } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_DASHBOARD, PATH_STORE } from "src/routes/paths";
import { ReactElement, useEffect, useState } from "react";
import Layout from "src/layouts";
import { fetchAuth } from "../../frontend-utils/nextjs/utils";
import NextLink from "next/link";

// ----------------------------------------------------------------------

ProductPendingFields.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export interface PendingField {
  label: string;
  pending_fields: PendingFieldEntry[];
}

export interface PendingFieldEntry {
  id: number;
  label: string;
}

export default function ProductPendingFields() {
  const [pendingFields, setPendingFields] = useState<PendingField[] | null>(
    null
  );

  useEffect(() => {
    fetchAuth(null, "products/pending_field_values/").then(
      (pendingFields: PendingField[]) => {
        const filteredPendingFields = pendingFields.filter(
          (pendingField) => pendingField.pending_fields.length
        );
        setPendingFields(filteredPendingFields);
      }
    );
  }, []);

  return (
    <Page title="Campos pendientes">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Campos pendientes" },
          ]}
        />
        {pendingFields &&
          pendingFields.map((pendingField) => (
            <Card style={{ marginBottom: "20px" }}>
              <CardHeader title={pendingField.label} />
              <CardContent>
                <ul style={{ listStyleType: "none" }}>
                  {pendingField.pending_fields.map((field) => (
                    <li>
                      <NextLink
                        href={`https://api.solotodo.com/metamodel/instances/${field.id}`}
                        passHref
                      >
                        <Link>{field.label}</Link>
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
      </Container>
    </Page>
  );
}
