import {Card, CardContent, CardHeader, Container, Grid} from "@mui/material";
import {useSnackbar} from "notistack";
import {ReactElement} from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSubmitComponent from "src/frontend-utils/api_form/fields/submit/ApiFormSubmitComponent";
import {
    selectApiResourceObjects,
    useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import {apiSettings} from "src/frontend-utils/settings";
import Layout from "src/layouts";
import {PATH_DASHBOARD, PATH_REPORTS} from "src/routes/paths";
import {useAppSelector} from "src/frontend-utils/redux/hooks";

// ----------------------------------------------------------------------

GroceriesCurrentPrices.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function GroceriesCurrentPrices() {
    const apiResourceObjects = useAppSelector(useApiResourceObjects);
    const {enqueueSnackbar} = useSnackbar();

    const fieldsMetadata = [
        {
            fieldType: "select" as "select",
            name: "stores",
            multiple: true,
            choices: selectApiResourceObjects(apiResourceObjects, "stores"),
        },
        {
            fieldType: "submit" as "submit",
        },
    ];

    return (
        <Page title="Precios actuales | Reportes">
            <Container maxWidth={false}>
                <HeaderBreadcrumbs
                    heading=""
                    links={[
                        {name: "Inicio", href: PATH_DASHBOARD.root},
                        {name: "Reportes", href: PATH_REPORTS.root},
                        {name: "Precios actuales"},
                    ]}
                />
                <ApiFormComponent
                    fieldsMetadata={fieldsMetadata}
                    endpoint={`${apiSettings.apiResourceEndpoints.reports}groceries_current_prices/`}
                    requiresSubmit={true}
                    onResultsChange={() =>
                        enqueueSnackbar(
                            "El reporte está siendo generado. Una vez finalizado este será enviado a su correo"
                        )
                    }
                >
                    <Card>
                        <CardHeader title="Filtros"/>
                        <CardContent>
                            <Grid
                                container
                                spacing={{xs: 2, md: 3}}
                                columns={{xs: 6, md: 12}}
                            >
                                <Grid item xs={6}>
                                    <ApiFormSelectComponent name="stores" label="Tiendas"/>
                                </Grid>
                                <Grid item xs={6}>
                                    <ApiFormSubmitComponent/>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </ApiFormComponent>
            </Container>
        </Page>
    );
}
