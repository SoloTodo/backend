import { SetStateAction, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { Button, Card, CardContent, CardHeader, CircularProgress, Link } from "@mui/material";
import NextLink from "next/link";
import { PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import CustomTable from "src/components/my_components/CustomTable";

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

  const [loadingAIFindSimilarProducts, setLoadingAIFindSimilarProducts] = useState(false);
  const [aiFindSimilarProducts, setAIFindSimilarProducts] = useState<FindSimilarProduct[] | null>(null);
  const [aiFindSimilarProductsError, setAIFindSimilarProductsError] = useState<FindSimilarProductsError | null>(null);

  useEffect(() => {
    setLoadingAIFindSimilarProducts(true);
    jwtFetch(null, `entities/${entity.id}/ai_find_similar_products/`).then((data) => {
      setAIFindSimilarProducts(data);
      setLoadingAIFindSimilarProducts(false);
    }).catch((error) => { 
      error.json().then((message: SetStateAction<FindSimilarProductsError | null>) => {
        setAIFindSimilarProductsError(message);
        setLoadingAIFindSimilarProducts(false);
      });
    });
  }, []);

  const handleAIFindSimilarProductsSubmit = () => {
    setAIFindSimilarProductsError(null);
    setLoadingAIFindSimilarProducts(true);
    jwtFetch(null, `entities/${entity.id}/ai_find_similar_products/`).then((data) => {
      setAIFindSimilarProducts(data);
      setLoadingAIFindSimilarProducts(false);
    }).catch((error) => { 
      error.json().then((message: SetStateAction<FindSimilarProductsError | null>) => {
        setAIFindSimilarProductsError(message);
        setLoadingAIFindSimilarProducts(false);
      });
    });
  };

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

  const generateLoadingElements = (count: number) => {
    return Array.from({ length: count }, (_, index) => <CircularProgress key={index} size={16} />);
  };

  return (
    <Card>
      <CardHeader title="Productos similares" />
      <CardContent>
        {loadingAIFindSimilarProducts ? (
          <CustomTable 
            headers={["Productos", "Confianza", "Razonamiento", "Asociar"]} 
            rows={[generateLoadingElements(4)]}
          />
        ) : aiFindSimilarProductsError ? (
          <CustomTable 
            headers={["Error", "Message"]} 
            rows={[["Error", aiFindSimilarProductsError["error"]]]}
          />
        ) : aiFindSimilarProducts && (
          <CustomTable 
            headers={["Producto", "Confianza", "Razonamiento", "Asociar"]}
            rows={aiFindSimilarProducts.map(entry => [
              <NextLink href={`${PATH_PRODUCT.root}/${entry["product"]["id"]}`} passHref>
                <Link>{entry["product"]["name"]}</Link>
              </NextLink>,
              entry["confidence"],
              entry["reasoning"],
              <Button 
                variant="contained" 
                onClick={() => { handleTableProductAssociationSubmit(entry["product"]["id"]) }}
              >
                Asociar
              </Button>
            ])}
          />
        )}
        <br />
        <Button 
          disabled={loadingAIFindSimilarProducts} 
          variant="contained" 
          onClick={() => { handleAIFindSimilarProductsSubmit() }}
        >
          {loadingAIFindSimilarProducts ? "Procesando..." : "Actualizar productos similares"}
        </Button>
      </CardContent>
    </Card>
  );
}
