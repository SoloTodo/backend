import NextLink from "next/link";
import { PATH_PRODUCT } from "src/routes/paths";
import { Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, Typography, Grid} from "@mui/material";
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
          <CustomTable headers={["Error", "Mensaje"]} rows={[["Error", aiAssociateError["error"]]]} />
        )}
        {aiAssociate && aiAssociate["ai_association_result"] && (
          <>
    <Grid container spacing={2}>
    <Grid item xs={5}>
    <Typography>Información inferida</Typography>
      <br />
      <CustomTable headers={["Field", "Value"]} rows={Object.entries(aiAssociate["ai_association_result"]["inferred_product_data"])}/>  
      </Grid>
      <Grid item xs={7}>
      <Typography>Productos similares</Typography>
            <br />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Confianza</TableCell>
                    <TableCell>Razonamiento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {aiAssociate["ai_association_result"]["similar_product_entries"].map((productData, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <NextLink href={`${PATH_PRODUCT.root}/${productData["product"]["id"]}`} passHref>
                          <Link>{productData["product"]["name"]}</Link>
                        </NextLink>
                      </TableCell>
                      <TableCell>{productData["confidence"]}%</TableCell>
                      <TableCell>{productData["reasoning"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <br />
      <Typography>Producto asociado</Typography>
            <br />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Producto creado</TableCell>
                    <TableCell>Instance model</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <NextLink href={`${PATH_PRODUCT.root}/${aiAssociate["ai_association_result"]["associated_product"]["id"]}`} passHref>
                        <Link>{aiAssociate["ai_association_result"]["associated_product"]["name"]}</Link>
                      </NextLink>
                    </TableCell>
                    <TableCell>{aiAssociate["ai_association_result"]["product_created"] ? "Si" : "No"}</TableCell>
                    <TableCell>
                      <Link target="_blank" href={`https://api.solotodo.com/metamodel/instances/${aiAssociate["ai_association_result"]["associated_product"]['instance_model_id']}`}>Link</Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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
