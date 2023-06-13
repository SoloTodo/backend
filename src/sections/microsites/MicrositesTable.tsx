import NextLink from "next/link";
import {
  Box,
  Button,
  IconButton,
  Link,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  GridColumns,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { Entry } from "src/frontend-utils/types/microsite";
import { PATH_PRODUCT } from "src/routes/paths";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { FocusEvent, useState } from "react";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MicrositesTable({
  entries,
  fields,
  handleDeleteEntry,
}: {
  entries: Entry[];
  fields: string;
  handleDeleteEntry: Function;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [open, setOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(false);

  const columns: GridColumns<Entry> = [
    {
      headerName: "Producto",
      field: "product.name",
      width: 200,
      renderCell: (params) => (
        <NextLink
          href={`${PATH_PRODUCT.root}/${params.row.product.id}`}
          passHref
        >
          <Tooltip title={params.row.product.name}>
            <Link>{params.row.product.name}</Link>
          </Tooltip>
        </NextLink>
      ),
    },
    {
      headerName: "Categoría",
      field: "category",
      width: 200,
      renderCell: (params) =>
        apiResourceObjects[params.row.product.category].name,
    },
  ];

  const getCustomName = (field: string) => {
    const fieldNumber = field.split("_")[2];
    return `Custom ${fieldNumber}`;
  };

  const onInputBlur = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    field: string,
    url: string
  ) => {
    const value = e.target.value || null;
    jwtFetch(null, url, {
      method: "PATCH",
      body: JSON.stringify({ [`${field}`]: value }),
    }).catch(async (error) => {
      const jsonError = await error.json();
      enqueueSnackbar(jsonError[field][0], {
        variant: "error",
      });
    });
  };

  const fieldNames: Record<string, string> = {
    ordering: "Ordenamiento",
    home_ordering: "Ordenamiento Home",
    sku: "SKU",
    brand_url: "URL",
    title: "Titulo",
    subtitle: "Subtitulo",
    description: "Descripción",
    reference_price: "Precio Referencia",
  };

  const extraFields = fields.split(",").map((field) => field.trim());

  extraFields.map((field) =>
    columns.push({
      headerName: fieldNames[field] || getCustomName(field),
      field: field,
      width: 150,
      renderCell: (params) => (
        <TextField
          defaultValue={(params.row as Record<string, any>)[field] ?? undefined}
          multiline={field === "description" || field === "subtitle"}
          rows={field === "description" || field === "subtitle" ? 2 : 1}
          variant="standard"
          size="small"
          inputProps={{ style: { fontSize: `${14 / 16}rem` } }}
          onBlur={(e) => onInputBlur(e, field, params.row.url)}
        />
      ),
    })
  );

  const openModal = (entry: Entry) => {
    setEntryToDelete(entry);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEntryToDelete(null);
  };

  columns.push({
    headerName: "Eliminar",
    field: "delete",
    width: 150,
    renderCell: (params) => (
      <IconButton color="error" onClick={() => openModal(params.row)}>
        <CloseIcon />
      </IconButton>
    ),
  });

  const handleDelete = () => {
    setLoading(true);
    handleDeleteEntry(entryToDelete).then((_: any) => {
      setLoading(false);
      closeModal();
    });
  };

  function QuickSearchToolbar() {
    return (
      <Stack
        alignItems="end"
        sx={{
          p: 0.5,
          pb: 0,
        }}
      >
        <GridToolbarQuickFilter />
      </Stack>
    );
  }

  return (
    <>
      <Box sx={{ height: "90vh", width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={entries}
          disableSelectionOnClick
          disableColumnSelector
          components={{ Toolbar: QuickSearchToolbar }}
          rowHeight={80}
        />
      </Box>
      <Modal open={open} onClose={closeModal}>
        <Box sx={style}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">{entryToDelete?.product.name}</Typography>
            <IconButton onClick={closeModal}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <br />
          <Typography>
            ¿Estás seguro que quieres eliminar este producto? Este proceso es
            irreversible
          </Typography>
          <br />
          <Stack spacing={1} direction="row">
            <LoadingButton
              onClick={handleDelete}
              color="error"
              variant="contained"
              loading={loading}
            >
              Eliminar
            </LoadingButton>
            <Button color="inherit" variant="outlined" onClick={closeModal}>
              Cancelar
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
