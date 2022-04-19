import { useRouter } from "next/router";
import { PATH_STORE } from "src/routes/paths";
import Options from "../Options";
import { Option } from "src/frontend-utils/types/extras";
import { Store } from "src/frontend-utils/types/store";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { apiSettings } from "src/frontend-utils/settings";
import { Link } from "@mui/material";
import { useAppSelector } from "src/store/hooks";
import { useUser } from "src/frontend-utils/redux/user";

export default function OptionsMenu({ store }: { store: Store }) {
  const user = useAppSelector(useUser);
  const router = useRouter();
  const baseRoute = `${PATH_STORE.root}/${router.query.id}`;

  const downloadMatchReport = () => {
    jwtFetch(
      null,
      `${apiSettings.apiResourceEndpoints.stores}${store.id}/matching_report/`
    ).then((res) => {
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
      hasPermission: store.permissions.includes('view_store_update_logs')
    },
    {
      text: "Entidades en conflicto",
      path: `${baseRoute}`,
      hasPermission: user?.is_superuser
    },
    {
      text: "Ratings",
      path: `${baseRoute}`,
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
