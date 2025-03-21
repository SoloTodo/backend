import NextLink from "next/link";
import { PATH_PRODUCT, PATH_METAMODEL} from "src/routes/paths";
import {Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Link} from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

export default function AIInferProductDataTable({
  entityId
}: {
  entityId: number;
}) {
  interface InferredProductData {
    inferred_product_data: {
      [key: string]: string | boolean | number;
    }
  }

  const [aiInferProductData, setAIInferProductData] = useState<InferredProductData | null>(null)
  const [loadingAIInferProductData, setLoadingAIInferProductData] = useState(false)
  const [loadingAICreateProduct, setLoadingAICreateProduct] = useState(false)
  const [aiCreatedProduct, setAICreatedProduct] = useState(false)
  const [aiCreatedProductError, setAICreatedProductError] = useState(false)

  useEffect(() => {
    setLoadingAIInferProductData(true)
    jwtFetch(null, `entities/${entityId}/ai_infer_product_data/`)
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
    setLoadingAIInferProductData(true);
    jwtFetch(null, `entities/${entityId}/ai_infer_product_data/`)
      .then((data) => {
        setAIInferProductData(data);
        setLoadingAIInferProductData(false);
      })
      .catch((error) => { 
        error.json().then((message: SetStateAction<InferredProductData | null>) => {
          setAIInferProductData(message);
          setLoadingAIInferProductData(false);
        });
      });
  };

  const handleAICreateProductSubmit = () => {
    setLoadingAICreateProduct(true);
    jwtFetch(null, `entities/${entityId}/ai_create_product/`, {
      method: "POST",
      body: JSON.stringify({"ignore_errors": true})
    }).then((data) => {
        setAICreatedProduct(data);
        setLoadingAICreateProduct(false);
      })
      .catch((error) => { 
        error.json().then((message: SetStateAction<InferredProductData | null>) => {
          setAICreatedProductError(message);
          setLoadingAICreateProduct(false);
        });
      });
  };

  return (
    <Card>
      <CardHeader title="Inferred product data" />
      <CardContent> 
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Field</TableCell>
                <TableCell>Value</TableCell>
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
                <TableCell>Message</TableCell>
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
                <TableCell>Product</TableCell>
                <TableCell>Edit instance model</TableCell>
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
                <TableCell>Message</TableCell>
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
          {loadingAIInferProductData ? "Procesando..." : "Refresh inferred product data"}
        </Button> 
        &nbsp;&nbsp;
        <Button disabled={loadingAIInferProductData || loadingAICreateProduct} variant="contained" onClick={handleAICreateProductSubmit}>
          {loadingAIInferProductData || loadingAICreateProduct ? "Procesando..." : "Create product"}
        </Button> 
      </CardContent>
    </Card>
  )
}
