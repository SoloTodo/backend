import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import { GridColumns } from "@mui/x-data-grid";
import { BannerAsset, Brand, Content } from "src/frontend-utils/types/banner";
import CustomTable from "../CustomTable";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { PATH_BANNERS } from "src/routes/paths";
import { useState } from "react";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import * as Yup from "yup";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type FormValuesProps = {
  brand: number | string;
  category: number | string;
  percentage: number;
};

export default function AssetContents(props: {
  asset: BannerAsset;
  brands: Brand[];
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [asset, setAsset] = useState(props.asset);
  const [open, setOpen] = useState(false);

  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = selectApiResourceObjects(apiResourceObjects, "categories");

  const brandChoices = props.brands.map((b) => ({
    label: b.name,
    value: b.id,
  }));

  const handleDeleteContent = async (id: number) => {
    await jwtFetch(null, `${asset.url}delete_content/`, {
      method: "post",
      body: JSON.stringify({ id: id }),
    })
      .then((json) => setAsset(json))
      .catch((err) => console.log(err));
  };

  const defaultValues = {
    brand: "",
    category: "",
    percentage: 0,
  };

  const NewContentSchema = Yup.object().shape({
    brand: Yup.string().required("Marca requerida"),
    category: Yup.string().required("Categoría requerida"),
    percentage: Yup.number()
      .required("Porcentaje requerido")
      .typeError("Ingresar un número válido")
      .moreThan(0, "Porcentaje debe ser mayor o igual a 1")
      .lessThan(101, "Porcentaje debe ser menor o igual a 100"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewContentSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: FormValuesProps) => {
    jwtFetch(null, `${asset.url}add_content/`, {
      method: "post",
      body: JSON.stringify(data),
    })
      .then((json) => {
        setAsset(json);
        reset();
        enqueueSnackbar("Contenido agregado exitosamente");
      })
      .catch(async (error) => {
        const jsonError = await error.json();
        console.error(jsonError);
        enqueueSnackbar(jsonError.errors.percentage[0], { variant: "error" });
      });
    setOpen(false);
  };

  const columns: GridColumns<Content> = [
    {
      headerName: "Marca",
      field: "brand.name",
      flex: 1,
      renderCell: (params) => params.row.brand.name,
    },
    {
      headerName: "Categoría",
      field: "category.name",
      flex: 1,
      renderCell: (params) => params.row.category.name,
    },
    {
      headerName: "Porcentaje",
      field: "percentage",
      flex: 1,
      renderCell: (params) => `${params.row.percentage}%`,
    },
    {
      headerName: "Eliminar",
      field: "id",
      flex: 1,
      renderCell: (params) => (
        <Button
          color="error"
          variant="contained"
          onClick={() => handleDeleteContent(params.row.id)}
        >
          <DeleteIcon /> Eliminar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader
          title="Contenidos"
          action={
            <Stack spacing={1} direction="row">
              {asset.is_complete ? (
                <>
                  <Button color="success" variant="contained" disabled>
                    <CheckIcon /> Completo!
                  </Button>
                  <Button
                    variant="contained"
                    href={`${PATH_BANNERS.assets}/pending`}
                  >
                    Ver pendientes
                  </Button>
                </>
              ) : (
                <Button
                  color="success"
                  variant="contained"
                  onClick={() => setOpen(true)}
                >
                  <AddIcon /> Agregar
                </Button>
              )}
            </Stack>
          }
        />
        <CardContent>
          <CustomTable data={asset.contents} columns={columns} />
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Agregar contenido
          </Typography>
          <br />
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2} direction="row">
              <RHFSelect name="brand" label="Marca">
                <option value=""></option>
                {brandChoices.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect name="category" label="Categoría">
                <option value=""></option>
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Stack>
            <br />
            <Stack>
              <RHFTextField
                name="percentage"
                label="Porcentaje"
                type="number"
              />
            </Stack>
            <br />
            <Stack spacing={1} direction="row">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                <AddIcon /> Agregar Contenido
              </LoadingButton>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </>
  );
}
