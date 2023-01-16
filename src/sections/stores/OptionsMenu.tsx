import { PATH_ENTITY, PATH_RATING, PATH_STORE } from "src/routes/paths";
import Options from "../Options";
import { Option } from "src/frontend-utils/types/extras";
import { Store } from "src/frontend-utils/types/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { Link } from "@mui/material";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useUser } from "src/frontend-utils/redux/user";
import { useSnackbar } from "notistack";

export default function OptionsMenu({ store }: { store: Store }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const user = useAppSelector(useUser);
  const baseRoute = `${PATH_STORE.root}/${store.id}`;

  const downloadMatchReport = () => {
    const key = enqueueSnackbar("Generando reporte de homologación, por favor espere!", {
      persist: true,
      variant: "info",
    });
    jwtFetch(
      null,
      `${store.url}matching_report/`
    ).then((res) => {
      closeSnackbar(key);
      window.location = res.url;
    });
  };

  const options: Option[] = [
    {
      text: "Información general",
      path: baseRoute,
      hasPermission: store.permissions.includes('view_store')
    },
    {
      text: "Actualizar pricing",
      path: `${baseRoute}/update_pricing`,
      hasPermission: store.permissions.includes('update_store_pricing')
    },
    {
      text: "Registros de actualización",
      path: `${baseRoute}/update_logs`,
      hasPermission: store.permissions.includes('view_store_update_logs') || user?.permissions.includes('solotodo.view_store_update_logs')
    },
    {
      text: "Entidades en conflicto",
      path: `${PATH_ENTITY.conflicts}/?stores=${store.id}`,
      hasPermission: user?.is_superuser
    },
    {
      text: "Ratings",
      path: `${PATH_RATING.root}/?stores=${store.id}`,
      hasPermission: user?.permissions.includes('solotodo.backend_list_ratings')
    },
    {
      text: "Descargar reporte de homologación",
      path: `${baseRoute}/matching_report`,
      hasPermission: store.permissions.includes('view_store_reports'),
      renderObject: (
        <Link
          component="button"
          variant="body1"
          onClick={downloadMatchReport}
          style={{ textAlign: "start" }}
        >
          Descargar reporte de homologación
        </Link>
      ),
    },
  ];

  return <Options options={options} defaultKey="text" />;
}
