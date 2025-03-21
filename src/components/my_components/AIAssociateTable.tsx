import NextLink from "next/link";
import { PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
import {Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Link} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { Entity } from "src/frontend-utils/types/entity";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

export default function AIAssociateTable({
  entity
}: {
  entity: Entity;
}) {

  interface Product {
    id: number;
    name: string;
    instance_model_id: number;
  }
  
  interface FindSimilarProduct {
    product: Product;
    confidence: number;
    reasoning: string;
  }
  
  interface FindSimilarProductsError {
    error: string;
  }


  const [aiAssociate, setAIAssociate] = useState({})
  const [loadingAIAssociate, setLoadingAIAssociate] = useState(false)
  const [aiAssociateError, setAIAssociateError] = useState({})
  
  const handleAIAssociateSubmit = () => {
    setLoadingAIAssociate(true)
    jwtFetch(null, `https://api.solotodo.com/entities/${entity.id}/ai_associate/`, {
      method: "POST",
    }).then((data) => {
      setAIAssociate(data)
      setLoadingAIAssociate(false)
    }).catch((error) => { 
      error.json().then((message) => {
        setAIAssociateError(message)
        setLoadingAIAssociate(false)
      })
    });
  }

  return (
    <Card>
      <CardHeader title={"AI Associate"}></CardHeader>
      <CardContent>
        <TableContainer>
            {aiAssociateError && aiAssociateError["error"] &&(
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Error</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              <TableCell>Error</TableCell>
                  <TableCell>{aiAssociateError["error"]}</TableCell>
              </TableBody>
              </Table>
            )}

{aiAssociate && aiAssociate["ai_association_result"] &&(
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Product created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              <TableCell>
                
                <NextLink href={`${PATH_PRODUCT.root}/${aiAssociate["ai_association_result"]["associated_product"]["id"]}`} passHref>
                  <Link>{aiAssociate["ai_association_result"]["associated_product"]["name"]}</Link>
                </NextLink>
              </TableCell>
              <TableCell>{aiAssociate["ai_association_result"]["product_created"] ? "Si": "No"}</TableCell>
              </TableBody>
              </Table>
            )}
        </TableContainer>
        <br />
        <Button disabled={loadingAIAssociate} variant="contained" onClick={() => {handleAIAssociateSubmit()}}>
        {loadingAIAssociate ? "Procesando..." : "AI Associate"}
        </Button> 
      </CardContent>       
    </Card>
  )
}
