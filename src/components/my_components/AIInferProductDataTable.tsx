import NextLink from "next/link";
import { PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
import { Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Link} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { Entity } from "src/frontend-utils/types/entity";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

export default function AIInferProductDataTable({
  entity
}: {
  entity: Entity
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  interface InferredProductData {
    inferred_product_data: {
      [key: string]: string | boolean | number
    }
    errors: {
      [key: string]: string
    }
  }
  interface CreatedProduct {
    id: number
    name: string
    instance_model_id: number
  }
  interface CreatedProductError {
    [key: string]: string
  }

  const [aiInferProductData, setAIInferProductData] = useState<InferredProductData | null>(null)
  const [loadingAIInferProductData, setLoadingAIInferProductData] = useState(false)
  const [loadingAICreateProduct, setLoadingAICreateProduct] = useState(false)
  const [aiCreatedProduct, setAICreatedProduct] = useState<CreatedProduct | null>(null)
  const [aiCreatedProductError, setAICreatedProductError] = useState<CreatedProductError | null>(null)

  useEffect(() => {
    setLoadingAIInferProductData(true)
    jwtFetch(null, `entities/${entity.id}/ai_infer_product_data/`)
      .then((data) => {
        setAIInferProductData(data);
        setLoadingAIInferProductData(false)
      })
      .catch((error) => { 
        error.json().then((message: SetStateAction<InferredProductData | null>) => {
          setAIInferProductData(message)
          setLoadingAIInferProductData(false)
        })
      })
  }, [])

  const handleAIInferProductDataSubmit = () => {
    setLoadingAIInferProductData(true)
    setAICreatedProductError(null)
    jwtFetch(null, `entities/${entity.id}/ai_infer_product_data/`)
      .then((data) => {
        setAIInferProductData(data)
        setLoadingAIInferProductData(false)
      })
      .catch((error) => { 
        error.json().then((message: SetStateAction<InferredProductData | null>) => {
          setAIInferProductData(message)
          setLoadingAIInferProductData(false)
        })
      })
  }

  const handleAICreateProductSubmit = () => {
    setAICreatedProductError(null)
    setLoadingAICreateProduct(true)
    jwtFetch(null, `entities/${entity.id}/ai_create_product/`, {
      method: "POST",
      body: JSON.stringify({"ignore_errors": true})
    }).then((data) => {
        setAICreatedProduct(data);
        setLoadingAICreateProduct(false);
      })
      .catch((error) => { 
        error.json().then((message: SetStateAction<CreatedProductError | null>) => {
          setAICreatedProductError(message)
          setLoadingAICreateProduct(false)
        })
      })
  }

  const handleTableProductAssociationSubmit = (productId: number) => {
    const key = enqueueSnackbar("Asociando entidad, por favor espera!", {
      persist: true,
      variant: "info",
    })

    const payload = {
      product: productId,
      bundle: null,
      cell_plan: null,
    }

    jwtFetch(null, entity.url + "associate/", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((data) => {
      closeSnackbar(key);
      enqueueSnackbar("La entidad ha sido asociada exitosamente!", {
        variant: "success",
      })
      router.push(
        `${PATH_ENTITY.pending}/?categories=${
          apiResourceObjects[entity.category]
        }`
      )
    })
  }

  return (
    <Card>
      <CardHeader title="Información inferida" />
      <CardContent> 
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campo</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {aiInferProductData && aiInferProductData["inferred_product_data"] ? (
                Object.keys(aiInferProductData["inferred_product_data"]).map((key) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    {loadingAIInferProductData ? (
                      <TableCell>
                        <CircularProgress size={16} />
                      </TableCell>
                    ) : (
                      aiInferProductData["inferred_product_data"] && (
                        <TableCell>
                          {typeof aiInferProductData["inferred_product_data"][key] === 'boolean'
                            ? aiInferProductData["inferred_product_data"][key] ? 'Sí' : 'No'
                            : aiInferProductData["inferred_product_data"][key]}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <CircularProgress size={16}/>
                  </TableCell>
                  <TableCell>
                    <CircularProgress size={16}/>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <br />
        {aiInferProductData && Object.keys(aiInferProductData["errors"]).length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Error</TableCell>
                <TableCell>Mensaje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(aiInferProductData["errors"]).map((key) => (
              <TableRow>
                <TableCell>{key}</TableCell>
                <TableCell>{aiInferProductData["errors"][key]}</TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
        {aiCreatedProduct && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Editar instance model</TableCell>
                <TableCell>Asociar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <NextLink href={`${PATH_PRODUCT.root}/${aiCreatedProduct["id"]}`} passHref>
                    <Link>{aiCreatedProduct["name"]}</Link>
                  </NextLink>
                </TableCell>
                <TableCell>
                  <Link target="_blank" href={`https://api.solotodo.com/metamodel/instances/${aiCreatedProduct['instance_model_id']}`}>Link</Link>
                </TableCell>
                <TableCell>
                  <Button variant="contained" onClick={() => {handleTableProductAssociationSubmit(aiCreatedProduct["id"], entity)}}>
                    Asociar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        )}
         {aiCreatedProductError && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Error</TableCell>
                <TableCell>Mensaje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Error</TableCell>
                <TableCell>{aiCreatedProductError["error"]}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        )}
        <br />
        <Button disabled={loadingAIInferProductData} variant="contained" onClick={handleAIInferProductDataSubmit}>
          {loadingAIInferProductData ? "Procesando..." : "Actualizar información inferida"}
        </Button> 
        &nbsp;&nbsp;
        <Button disabled={loadingAIInferProductData || loadingAICreateProduct} variant="contained" onClick={handleAICreateProductSubmit}>
          {loadingAIInferProductData || loadingAICreateProduct ? "Procesando..." : "Crear producto"}
        </Button> 
      </CardContent>
    </Card>
  )
}
