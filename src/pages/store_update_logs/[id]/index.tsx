import {Container, Grid} from "@mui/material";
import { ReactElement } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import {PATH_DASHBOARD, PATH_STORE} from "src/routes/paths";
import {GetServerSideProps} from "next/types";
import {jwtFetch} from "../../../frontend-utils/nextjs/utils";
import {apiSettings} from "../../../frontend-utils/settings";
import CustomTable from "../../../sections/CustomTable";
import {GridColDef} from "@mui/x-data-grid";
import {fDateTimeSuffixSecs} from "../../../utils/formatTime";
import styles from './store_update_log_registry.module.css'
import {Store, Update} from "../../../frontend-utils/types/store";
import {useAppSelector} from "../../../frontend-utils/redux/hooks";
import {useApiResourceObjects} from "../../../frontend-utils/redux/api_resources/apiResources";

type StoreUpdateLogEntry = {
    message: string;
    level: string;
    timestamp: string;
};

type StoreUpdateLogPageProps = {
  update_logs_registry: StoreUpdateLogEntry[];
  update_log: Update;
}

// ----------------------------------------------------------------------

StoreUpdateLogPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function StoreUpdateLogPage(props: StoreUpdateLogPageProps) {
    const apiResourceObjects = useAppSelector(useApiResourceObjects);
    const store = apiResourceObjects[props.update_log.store] as Store;

    const columns: GridColDef[] = [
    {
      headerName: "Timestamp",
      field: "timestamp",
      flex: 1,
        renderCell: (params) => fDateTimeSuffixSecs(params.row.timestamp)
    },
    {
      headerName: "Nivel",
      field: "level",
      flex: 1,
    },
    {
      headerName: "Mensaje",
      field: "message",
      flex: 1,
        renderCell: (params) => <div className={styles.linebreak}>{params.row.message}</div>
    },
  ];

  return (
    <Page title={`${store.name} > Registros de actualización > ${props.update_log.id}`}>
      <Container maxWidth={false}>
                <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Inicio", href: PATH_DASHBOARD.root },
            { name: "Tiendas", href: PATH_STORE.root },
            { name: `${store.name}`, href: `${PATH_STORE.root}/${store.id}` },
            { name: "Registros de actualización", href: `${PATH_STORE.root}/${store.id}/update_logs` },
            { name: `${props.update_log.id}` },
          ]}
        />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomTable data={props.update_logs_registry} columns={columns} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const update_logs_registry = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.store_update_logs}${context.params?.id}/registry/`
  );
  const update_log = await jwtFetch(
    context,
    `${apiSettings.apiResourceEndpoints.store_update_logs}${context.params?.id}/`
  );
  return {
    props: {
      update_logs_registry,
        update_log
    },
  };
};
