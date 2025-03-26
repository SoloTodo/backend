import NextLink from "next/link";
import { PATH_PRODUCT } from "src/routes/paths";
import { Button, Card, CardContent, CardHeader, Link, Typography, Grid } from "@mui/material";
import { SetStateAction, useState } from "react";
import CustomTable from "src/components/my_components/CustomTable";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Entity } from "src/frontend-utils/types/entity";

export default function AIAssociateTable({
  entity
}: {
  entity: Entity;
}) {
  interface AssociateError {
    [key: string]: string;
  }

  interface AssociationResult {
    ai_association_result: any;
  }

  const [loadingAIAssociate, setLoadingAIAssociate] = useState(false);
  const [aiAssociate, setAIAssociate] = useState<AssociationResult | null>(null);
  const [aiAssociateError, setAIAssociateError] = useState<AssociateError | null>(null);

  const handleAIAssociateSubmit = () => {
    setAIAssociateError(null);
    setLoadingAIAssociate(true);
    jwtFetch(null, `https://api.solotodo.com/entities/${entity.id}/ai_associate/`, {
      method: "POST",
    }).then((data) => {
      setAIAssociate(data);
      setLoadingAIAssociate(false);
    }).catch((error) => {
      error.json().then((message: SetStateAction<AssociateError | null>) => {
        setAIAssociateError(message);
        setLoadingAIAssociate(false);
      });
    });
  };

  return (
    <Card>
      <CardHeader title={"Asociar con IA"} />
      <CardContent>
        {aiAssociateError && aiAssociateError["error"] && (
          <CustomTable
            headers={["Error", "Mensaje"]}
            rows={[["Error", aiAssociateError["error"]]]}
          />
        )}
        {aiAssociate && aiAssociate["ai_association_result"] && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <Typography>Información inferida</Typography>
                <br />
                <CustomTable
                  headers={["Field", "Value"]}
                  rows={Object.entries(aiAssociate["ai_association_result"]["inferred_product_data"])}
                />
              </Grid>
              <Grid item xs={7}>
                <Typography>Productos similares</Typography>
                <br />
                <CustomTable
                  headers={["Producto", "Confianza", "Razonamiento"]}
                  rows={aiAssociate["ai_association_result"]["similar_product_entries"].map((entry: { [key: string]: any; }) => [
                    <NextLink href={`${PATH_PRODUCT.root}/${entry["product"]["id"]}`} passHref>
                      <Link>{entry["product"]["name"]}</Link>
                    </NextLink>,
                    entry["confidence"],
                    entry["reasoning"],
                  ])}
                />
                <br />
                <Typography>Producto asociado</Typography>
                <br />
                <CustomTable
                  headers={["Producto", "Creado durante la asociación", "Instance model"]}
                  rows={[
                    [
                      <NextLink href={`${PATH_PRODUCT.root}/${aiAssociate["ai_association_result"]["associated_product"]["id"]}`} passHref>
                        <Link>{aiAssociate["ai_association_result"]["associated_product"]["name"]}</Link>
                      </NextLink>,
                      aiAssociate["ai_association_result"]["product_created"],
                      <Link target="_blank" href={`https://api.solotodo.com/metamodel/instances/${aiAssociate["ai_association_result"]["associated_product"]['instance_model_id']}`}>Link</Link>
                    ]
                  ]}
                />
              </Grid>
            </Grid>
          </>
        )}
        <br />
        <Button disabled={loadingAIAssociate} variant="contained" onClick={() => { handleAIAssociateSubmit(); }}>
          {loadingAIAssociate ? "Procesando..." : "Asociar con IA"}
        </Button>
      </CardContent>
    </Card>
  );
}
