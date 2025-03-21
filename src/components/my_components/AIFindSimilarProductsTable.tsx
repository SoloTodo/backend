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

export default function AIFindSimilarProductsTable({
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

  const [loadingAIFindSimilarProducts, setLoadingAIFindSimilarProducts] = useState(false)
  const [aiFindSimilarProducts, setAIFindSimilarProducts] = useState<FindSimilarProduct[] | null>(null)
  const [aiFindSimilarProductsError, setAIFindSimilarProductsError] = useState<FindSimilarProductsError | null>(null)

  useEffect(() => {
    setLoadingAIFindSimilarProducts(true)
    jwtFetch(null, `entities/${entity.id}/ai_find_similar_products/`).then((data) => {
      setAIFindSimilarProducts(data)
      setLoadingAIFindSimilarProducts(false)
    }).catch((error) => { 
      error.json().then((message: SetStateAction<FindSimilarProductsError | null>) => {
        setAIFindSimilarProductsError(message)
        setLoadingAIFindSimilarProducts(false)
      })
    });
  }, [])


  const handleAIFindSimilarProductsSubmit = () => {
    setLoadingAIFindSimilarProducts(true)
    jwtFetch(null, `entities/${entity.id}/ai_find_similar_products/`).then((data) => {
      setAIFindSimilarProducts(data)
      setLoadingAIFindSimilarProducts(false)
    }).catch((error) => { 
      error.json().then((message: SetStateAction<FindSimilarProductsError | null>) => {
        setAIFindSimilarProductsError(message)
        setLoadingAIFindSimilarProducts(false)
      })
    });
  }

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const handleTableProductAssociationSubmit = (productId: number) => {
    const key = enqueueSnackbar("Asociando entidad, por favor espera!", {
      persist: true,
      variant: "info",
    });

    const payload = {
      product: productId,
      bundle: null,
      cell_plan: null,
    };

    jwtFetch(null, entity.url + "associate/", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((data) => {
      closeSnackbar(key);
      enqueueSnackbar("La entidad ha sido asociada exitosamente!", {
        variant: "success",
      });
      router.push(
        `${PATH_ENTITY.pending}/?categories=${
          apiResourceObjects[entity.category].id
        }`
      );
    });

  };

  return (
    <Card>
    <CardHeader title="Similar products"/> 
    <CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Reasoning</TableCell>
              <TableCell>Associate</TableCell>
            </TableRow> 
          </TableHead>
          <TableBody>
          {loadingAIFindSimilarProducts ? (
              <TableRow>
                <TableCell><CircularProgress size={16}/></TableCell>
                <TableCell><CircularProgress size={16}/></TableCell>
                <TableCell><CircularProgress size={16}/></TableCell>
                <TableCell><CircularProgress size={16}/></TableCell>
              </TableRow>
            ):(
            aiFindSimilarProductsError ? (
              <TableRow>
                <TableCell>Error</TableCell>
                <TableCell colSpan={3}>{aiFindSimilarProductsError["error"]}</TableCell>
              </TableRow>
            ):(
            aiFindSimilarProducts && aiFindSimilarProducts.map((productData, index) => (
              <TableRow key={index}>
                <TableCell> 
                  <NextLink href={`${PATH_PRODUCT.root}/${productData["product"]["id"]}`} passHref>
                    <Link>{productData["product"]["name"]}</Link>
                  </NextLink>
                </TableCell>
                <TableCell>{productData["confidence"]}%</TableCell>
                <TableCell>{productData["reasoning"]}</TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => {handleTableProductAssociationSubmit(productData["product"]["id"])}}>
                    Asociar
                  </Button>
                </TableCell>
              </TableRow>
          ))
        ))}
        </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button disabled={loadingAIFindSimilarProducts} variant="contained" onClick={() => {handleAIFindSimilarProductsSubmit()}}>
                {loadingAIFindSimilarProducts ? "Procesando..." : "Refresh similar products"}
                </Button> 
    </CardContent>
    </Card>
  )
}
