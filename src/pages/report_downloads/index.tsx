import {ReactElement} from "react";
import NextLink from "next/link";
// layout
import Layout from "src/layouts";
// hooks
import {useAppSelector} from "src/frontend-utils/redux/hooks";
// api form
import {
    selectApiResourceObjects,
    useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import {
    Container,
    Link,
    Stack,
} from "@mui/material";
import {PATH_DASHBOARD, PATH_REPORT_DOWNLOADS} from "src/routes/paths";
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import {apiSettings} from "src/frontend-utils/settings";
import ApiFormPaginationTable from "src/components/api_form/ApiFormPaginationTable";
import {ReportDownload, ReportDownloadStatusDict} from "src/frontend-utils/types/report";
import {fDateTimeSuffix} from "src/utils/formatTime";
import {fetchAuth} from "src/frontend-utils/nextjs/utils";

// ----------------------------------------------------------------------

ReportDownloads.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ReportDownloads() {
    const apiResourceObjects = useAppSelector(useApiResourceObjects);

    const fieldMetadata = [
        {
            fieldType: "pagination" as "pagination",
        },
        {
            fieldType: "select" as "select",
            name: "stores",
            multiple: true,
            choices: selectApiResourceObjects(apiResourceObjects, "stores"),
        },
    ];

    const columns: any[] = [
        {
            headerName: "ID",
            field: "id",
            flex: 1,
        },
        {
            headerName: "Fecha creación",
            field: "creation_date",
            renderCell: (row: ReportDownload) => fDateTimeSuffix(row.timestamp),
            flex: 1,
        },
        {
            headerName: "Reporte",
            field: "report",
            renderCell: (row: ReportDownload) => row.report.name,
            flex: 1,
        },
        {
            headerName: "Estado",
            field: "status",
            renderCell: (row: ReportDownload) => ReportDownloadStatusDict[row.status],
            flex: 1,
        },
        {
            headerName: "Link descarga",
            field: "producto",
            flex: 1,
            renderCell: (row: ReportDownload) => {
                if (row.status == 3) {
                    return <Link href='#' onClick={evt => {
                        evt.preventDefault();
                        handleReportDownloadClick(row)
                    }}>Descargar</Link>
                } else {
                    return 'N/A'
                }
            },
        },
    ];

    const handleReportDownloadClick = (row: ReportDownload) => {
        fetchAuth(null, row.url + 'download_url/').then(res => {
            window.location = res.url
        })
    }

    return (
        <Page title="Descargas de reportes">
            <Container maxWidth={false}>
                <HeaderBreadcrumbs
                    heading=""
                    links={[
                        {name: "Inicio", href: PATH_DASHBOARD.root},
                        {name: "Descargas de reportes", href: PATH_REPORT_DOWNLOADS.root},
                    ]}
                />
                <ApiFormComponent
                    fieldsMetadata={fieldMetadata}
                    endpoint={`${apiSettings.apiResourceEndpoints.report_downloads}`}
                >
                    <Stack spacing={3}>
                        <ApiFormPaginationTable
                            columns={columns}
                            title="Descargas"
                        />
                    </Stack>
                </ApiFormComponent>
            </Container>
        </Page>
    );
}
