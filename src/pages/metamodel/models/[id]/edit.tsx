import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import NextLink from "next/link";
import { GetServerSideProps } from "next/types";
import { ReactElement, useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { MetaField, MetaModel } from "src/frontend-utils/types/metamodel";
import Layout from "src/layouts";
import { PATH_DASHBOARD, PATH_METAMODEL } from "src/routes/paths";
import CustomTable from "src/sections/CustomTable";
import { GridColDef } from "@mui/x-data-grid";
import EditmodelProperties from "src/sections/metamodel/EditModelProperties";
import AddOrEditMetaModelField from "src/sections/metamodel/AddOrEditMetaFieldForm";
import MetaModelFindUsages from "src/sections/metamodel/MetaModelFindUsages";

// ----------------------------------------------------------------------

MetaModelEditStructure.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function MetaModelEditStructure({
  initialMetaModel,
}: {
  initialMetaModel: MetaModel;
}) {
  const [metaModel, setMetaModel] = useState(initialMetaModel);
  const [editOrderingRow, setEditOrderingRow] = useState<string | null>(null);
  const [editOrderingValue, setEditOrderingValue] = useState("");

  useEffect(() => setMetaModel(initialMetaModel), [initialMetaModel]);

  const updateMetaModelProperties = (data: MetaModel) => {
    const newModel: MetaModel = {
      ...metaModel,
      name: data.name,
      ordering_field: data.ordering_field,
      unicode_template: data.unicode_template,
    };
    setMetaModel(newModel);
  };

  const addOrUpdateMetaModelField = (data: MetaField) => {
    const newFields = [...metaModel.fields!];
    const pos = newFields.findIndex((item) => item.id === data.id);
    if (pos >= 0) {
      newFields[pos] = data;
    } else {
      newFields.push(data);
    }
    newFields.sort((a, b) => a.ordering - b.ordering);
    const newModel = {
      ...metaModel,
      fields: newFields,
    };
    setMetaModel(newModel);
  };

  const closeEditOrdering = () => {
    setEditOrderingRow(null);
    setEditOrderingValue("");
  };

  const handleEditOrdering = () => {
    if (editOrderingValue === "" || editOrderingRow === null) {
      closeEditOrdering();
    } else {
      jwtFetch(
        null,
        `${apiSettings.apiResourceEndpoints.metamodel_meta_fields}${editOrderingRow}/`,
        {
          method: "patch",
          body: JSON.stringify({ ordering: editOrderingValue }),
        }
      )
        .then((res) => {
          addOrUpdateMetaModelField(res);
        })
        .finally(closeEditOrdering);
    }
  };

  const columns: GridColDef<MetaField>[] = [
    {
      headerName: "Field",
      field: "name",
      renderCell: (params) => (
        <Stack alignItems="start">
          <AddOrEditMetaModelField
            updateMetaModelField={addOrUpdateMetaModelField}
            setMetaModel={setMetaModel}
            metaField={params.row}
          />
          <Typography variant="caption">{params.row.help_text}</Typography>
        </Stack>
      ),
    },
    {
      headerName: "Type",
      field: "model_name",
      renderCell: (params) =>
        params.row.model.is_primitive ? (
          params.row.model.name
        ) : (
          <NextLink
            href={`${PATH_METAMODEL.models}/${params.row.model.id}/edit`}
            passHref
          >
            <Link>{params.row.model.name}</Link>
          </NextLink>
        ),
    },
    {
      headerName: "Nullable",
      field: "nullable",
      renderCell: (params) =>
        params.row.nullable ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Multiple",
      field: "multiple",
      renderCell: (params) =>
        params.row.multiple ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Hidden",
      field: "hidden",
      renderCell: (params) =>
        params.row.hidden ? <CheckIcon /> : <ClearIcon />,
    },
    {
      headerName: "Ordering",
      field: "ordering",
      renderCell: (params) => {
        if (!editOrderingRow || editOrderingRow !== params.row.id) {
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography>{params.row.ordering}</Typography>
              {!editOrderingRow && (
                <IconButton
                  onClick={() => {
                    setEditOrderingRow(params.row.id);
                    setEditOrderingValue(params.row.ordering.toString());
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Stack>
          );
        } else {
          return (
            <Stack direction="row" alignItems="center">
              <TextField
                type="number"
                size="small"
                value={editOrderingValue}
                onChange={(e) => setEditOrderingValue(e.target.value)}
              />
              <Stack direction="row">
                <IconButton onClick={handleEditOrdering}>
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={closeEditOrdering}>
                  <ClearIcon />
                </IconButton>
              </Stack>
            </Stack>
          );
        }
      },
    },
  ];

  return (
    <Page title={`${metaModel.name} | Editar Estructura`}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Modelos", href: PATH_METAMODEL.models },
            {
              name: metaModel.name,
              href: `${PATH_METAMODEL.models}/${metaModel.id}`,
            },
            { name: "Editar Estructura" },
          ]}
        />
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={6} sm={4} md={2.4}>
                  <NextLink
                    href={`${PATH_METAMODEL.models}/${metaModel.id}`}
                    passHref
                  >
                    <Button variant="contained" fullWidth>
                      Editar Instancia
                    </Button>
                  </NextLink>
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                  <EditmodelProperties
                    metaModel={metaModel}
                    updateMetaModelProperties={updateMetaModelProperties}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                  <AddOrEditMetaModelField
                    metaModelId={metaModel.id}
                    updateMetaModelField={addOrUpdateMetaModelField}
                  />
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                  <MetaModelFindUsages metaModel={metaModel} />
                </Grid>
                <Grid item xs={6} sm={4} md={2.4}>
                  <Button variant="contained" fullWidth>
                    Eliminar Modelo
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={`${metaModel.name} | Editar Estructura`} />
            <CardContent>
              <CustomTable columns={columns} data={metaModel.fields || []} />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const metaModel = await jwtFetch(
      context,
      `${apiSettings.apiResourceEndpoints.metamodel_meta_models}${context.params?.id}/`
    );
    return {
      props: {
        initialMetaModel: metaModel,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
