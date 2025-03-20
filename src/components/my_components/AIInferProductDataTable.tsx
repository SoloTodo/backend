import {Button, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress} from "@mui/material";
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

  useEffect(() => {
    setLoadingAIInferProductData(true)
    jwtFetch(null, `https://api.solotodo.com/entities/${entityId}/ai_infer_product_data/`)
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
    jwtFetch(null, `https://api.solotodo.com/entities/${entityId}/ai_infer_product_data/`)
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
        <Button disabled={loadingAIInferProductData} variant="contained" onClick={handleAIInferProductDataSubmit}>
          {loadingAIInferProductData ? "Procesando..." : "Refresh inferred product data"}
        </Button> 
      </CardContent>
    </Card>
  )
}
