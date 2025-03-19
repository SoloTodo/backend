import { 
  Button, 
  Card, 
  CardActions,
  CardContent, 
  CardHeader, 
  Grid, 
  Stack,
  TextField,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { SetStateAction, useEffect, useState } from "react";
import BundleSelect from "src/components/my_components/BundleSelect";
import CellPlanSelect from "src/components/my_components/CellPlanSelect";
import ProductSearch from "src/components/my_components/ProductSearch";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { apiSettings } from "src/frontend-utils/settings";
import { Bundle, CellPlan, Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { PATH_ENTITY, PATH_PRODUCT } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import * as React from 'react';

export default function AIAssociateForm({
  entity,
  setEntity,
}: {
  entity: Entity;
  setEntity: Function;
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCellPlan, setSelectedCellPlan] = useState<CellPlan | null>(
    null
  );
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [aiResponse, setAIResponse] = useState('')

  const handleProductAssociationSubmit = () => {
    if (entity.cell_plan_name && !selectedCellPlan) {
      enqueueSnackbar("Debe seleccionar un plan celular.", {
        variant: "error",
      });
      return;
    }

    const payload = {
      product: selectedProduct ? selectedProduct.id : null,
      bundle: selectedBundle ? selectedBundle.id : null,
      cell_plan: null as number | null,
    };

    let matchExistingCellPlan = false;
    if (selectedCellPlan) {
      payload.cell_plan = selectedCellPlan.id;
      matchExistingCellPlan =
        entity.cell_plan !== null &&
        entity.cell_plan.id === selectedCellPlan.id;
    } else {
      matchExistingCellPlan = !entity.cell_plan;
    }

    if (
      entity.product &&
      selectedProduct &&
      entity.product.id === selectedProduct.id &&
      matchExistingCellPlan &&
      (entity.bundle ? entity.bundle.id : null) === selectedBundle
    ) {
      enqueueSnackbar(
        "Por favor seleccionar otro producto / plan celular que el que ya está asignado.",
        { variant: "error", persist: true }
      );
      return;
    }

    const key = enqueueSnackbar("Asociando entidad, por favor espera!", {
      persist: true,
      variant: "info",
    });
    jwtFetch(null, entity.url + "associate/", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((data) => {
      closeSnackbar(key);
      setEntity(data);
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


  const [aiAssociationResults, setAIAssociationResults] = useState({});
  const [aiFindSimilarProducts, setAIFindSimilarProducts] = useState({});
  const [aiInferProductData, setAIInferProductData] = useState({});
  const [aiUpdateCategory, setAIUpdateCategory] = useState({});
  const [aiAssociate, setAIAssociate] = useState({});
  const [loadingAIInferProductData, setLoadingAIInferProductData] = useState(false);
  const [loadingAIFindSimilarProducts, setLoadingAIFindSimilarProducts] = useState(false);
  const [loadingAIUpdateCategory, setLoadingAIUpdateCategory] = useState(false);
  const [loadingAIAssociate, setLoadingAIAssociate] = useState(false);
  const [inferredProductDataTable, setInferredProductDataTable] = useState({});
  const [similarProductEntriesTable, setSimilarProductEntriesTable] = useState([]);

  useEffect(() => {
    jwtFetch(null, 'https://api.solotodo.com/entities/' + entity.id +'/ai_association_result/')
    .then((response) => {
      setAIAssociationResults(response);
      setInferredProductDataTable(prevState => ({ 
        ...prevState, 
        ...response["inferred_product_data"]
      }));
      setSimilarProductEntriesTable(prevState => ({
        ...prevState,
        ...response["similar_product_entries"]
      }));
      console.log(response["similar_product_entries"])
    })
  }, [])

  const handleProductClone = () => {
    const key = enqueueSnackbar("Clonando producto, por favor espera!", {
      persist: true,
      variant: "info",
    });
    selectedProduct &&
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.products}${selectedProduct.id}/clone/`,
        {
          method: "POST",
        }
      ).then((data) => {
        const clonedInstanceId = data.instance_id;
        const clonedInstanceUrl = `${apiSettings.endpoint}metamodel/instances/${clonedInstanceId}`;
        closeSnackbar(key);
        window.open(clonedInstanceUrl, "_blank");
      });
  };

  const handleAIInferProductDataSubmit = () => {
    setLoadingAIInferProductData(true)
    jwtFetch(null, `https://api.solotodo.com/entities/${entity.id}/ai_infer_product_data/`).then((data) => {
      setAIInferProductData(data)
      setLoadingAIInferProductData(false)
    }).catch((error) => { 
      error.json().then((message: SetStateAction<{}>) => {
        setAIInferProductData(message)
        setLoadingAIInferProductData(false)
      })
    });
  }

  const handleAIFindSimilarProductsSubmit = () => {
    setLoadingAIFindSimilarProducts(true)
    jwtFetch(null, `https://api.solotodo.com/entities/${entity.id}/ai_find_similar_products/`).then((data) => {
      setAIFindSimilarProducts(data)
      setLoadingAIFindSimilarProducts(false)
    }).catch((error) => { 
      error.json().then((message: SetStateAction<{}>) => {
        setAIFindSimilarProducts(message)
        setLoadingAIFindSimilarProducts(false)
      })
    });
  }

  const handleAIUpdateCategorySubmit = () => {
    setLoadingAIUpdateCategory(true)
    jwtFetch(null, `https://api.solotodo.com/entities/${entity.id}/ai_update_category/`, {
      method: "POST",
    }).then((data) => {
      setAIUpdateCategory(data)
      setLoadingAIUpdateCategory(false)
    }).catch((error) => { 
      error.json().then((message: SetStateAction<{}>) => {
        setAIUpdateCategory(message)
        setLoadingAIUpdateCategory(false)
      })
    });
  }

  const handleAIAssociateSubmit = () => {
    setLoadingAIAssociate(true)
    jwtFetch(null, `https://api.solotodo.com/entities/${entity.id}/ai_associate/`, {
      method: "POST",
    }).then((data) => {
      setAIAssociate(data)
      setLoadingAIAssociate(false)
    }).catch((error) => { 
      error.json().then((message: SetStateAction<{}>) => {
        setAIAssociate(message)
        setLoadingAIAssociate(false)
      })
    });
  }

  return (
    <>
    <Card>
    <CardHeader title="Inferred product data"/>
    <CardContent>
    <TableContainer>
      <Table>
      <TableHead>
        <TableRow>
          {Object.keys(inferredProductDataTable).map((key) => (
            <TableCell>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
        <TableBody>
            <TableRow>
                {Object.keys(inferredProductDataTable).map((key) => (
                <TableCell>
                {typeof inferredProductDataTable[key] === 'boolean'
                  ? inferredProductDataTable[key] ? 'Sí' : 'No'
                  : inferredProductDataTable[key]} 
              </TableCell>
              ))}
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </CardContent>
    </Card>
    <br />
    <Card>
    <CardHeader title="Similar product entries"/> 
    <CardContent>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Confidence</TableCell>
              <TableCell>Reasoning</TableCell>
            </TableRow> 
          </TableHead>
          <TableBody>
          {Object.keys(similarProductEntriesTable).map((key) => (
          <TableRow>
           {Object.keys(similarProductEntriesTable[key]).map((product) => (
                <TableCell>
                {product === "product" ? similarProductEntriesTable[key][product]["name"] + ' (' + similarProductEntriesTable[key][product]["id"] + ')' : similarProductEntriesTable[key][product]} 
                </TableCell>
           ))}
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
    </Card>
    <br />
    <Card>
    <CardHeader title="AI Association result errors"/> 
    <CardContent>
      <Box component="pre" maxHeight={320} overflow={"auto"}>
                {JSON.stringify(aiAssociationResults["errors"], null, 2)}
      </Box>
      </CardContent>
      </Card>
    <br />
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Card>
          <CardHeader title={"Infer product data"}></CardHeader>
            <CardContent>
              <Box component="pre" maxHeight={320} overflow={"auto"}>
                {JSON.stringify(aiInferProductData, null, 2)}
              </Box>
              <br />
              <CardActions>
                <Button disabled={loadingAIInferProductData} variant="contained" onClick={() => {handleAIInferProductDataSubmit()}}>
                  {loadingAIInferProductData ? "Procesando..." : "Infer product data"}
                </Button> 
              </CardActions>
            </CardContent>       
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardHeader title={"Find similar products"}></CardHeader>
            <CardContent>
              <Box component="pre" maxHeight={320} overflow={"auto"}>
                {JSON.stringify(aiFindSimilarProducts, null, 2)}
              </Box>
              <br />
              <CardActions>
                <Button disabled={loadingAIFindSimilarProducts} variant="contained" onClick={() => {handleAIFindSimilarProductsSubmit()}}>
                {loadingAIFindSimilarProducts ? "Procesando..." : "Find Similar Products"}
                </Button> 
              </CardActions>
            </CardContent>       
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardHeader title={"Update category"}></CardHeader>
            <CardContent>
              <Box component="pre" maxHeight={320} overflow={"auto"}>
                {JSON.stringify(aiUpdateCategory, null, 2)}
              </Box>
              <br />
              <CardActions>
                <Button disabled={loadingAIUpdateCategory} variant="contained" onClick={() => {handleAIUpdateCategorySubmit()}}>
                {loadingAIUpdateCategory ? "Procesando..." : "Update category"}
                </Button> 
              </CardActions>
            </CardContent>       
        </Card>
      </Grid>

      <Grid item xs={6}>
        <Card>
          <CardHeader title={"AI Associate"}></CardHeader>
            <CardContent>
              <Box component="pre" maxHeight={320} overflow={"auto"}>
                {JSON.stringify(aiAssociate, null, 2)}
              </Box>
              <br />
              <CardActions>
                <Button disabled={loadingAIAssociate} variant="contained" onClick={() => {handleAIAssociateSubmit()}}>
                {loadingAIAssociate ? "Procesando..." : "AI Associate"}
                </Button> 
              </CardActions>
            </CardContent>       
        </Card>
      </Grid>
    </Grid>
    </>
  );
}
