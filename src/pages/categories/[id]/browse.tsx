import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
} from "@mui/material";
import {ReactElement} from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import Layout from "src/layouts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {PATH_CATEGORY, PATH_DASHBOARD} from "src/routes/paths";
import {
    getApiResourceObject,
    selectApiResourceObjects,
    useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import {useAppSelector} from "src/frontend-utils/redux/hooks";
import {useRouter} from "next/router";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import {NextPageContext} from "next/types";
import {
    getCategoryColumns,
    getCategorySpecsFromLayout
} from "src/frontend-utils/nextjs/utils";
import {apiSettings} from "src/frontend-utils/settings";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import CategoryDetailBrowseTable from "src/sections/categories/CategoryDetailBrowseTable";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import {ApiFormFieldMetadata} from "src/frontend-utils/api_form/ApiForm";
import ApiFormPriceRangeComponent from "src/frontend-utils/api_form/fields/price_range/ApiFormPriceRangeComponent";
import {Currency} from "src/frontend-utils/redux/api_resources/types";
import {
    CategoryColumn,
    CategorySpecsFormLayoutProps
} from "src/frontend-utils/types/store";
import {websiteId} from "../../../config";
import ApiFormPaginationComponent
    from "../../../frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";

// ----------------------------------------------------------------------

CategoryBrowse.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function CategoryBrowse({
                                           categorySpecsFormLayout,
                                           columns
                                       }: {
    categorySpecsFormLayout: CategorySpecsFormLayoutProps;
    columns: CategoryColumn[];
}) {
    const apiResourceObjects = useAppSelector(useApiResourceObjects);
    const router = useRouter();
    const categoryId = router.query.id as string;
    const category = getApiResourceObject(
        apiResourceObjects,
        "categories",
        categoryId
    );

    const fieldsMetadata: ApiFormFieldMetadata[] = [
        {
            fieldType: "pagination" as "pagination",
        },
        {
            fieldType: "select" as "select",
            name: "stores",
            multiple: true,
            choices: selectApiResourceObjects(apiResourceObjects, "stores"),
        },
        {
            fieldType: "select" as "select",
            name: "countries",
            multiple: true,
            choices: selectApiResourceObjects(apiResourceObjects, "countries"),
        },
        {
            fieldType: "select" as "select",
            name: "types",
            multiple: true,
            choices: selectApiResourceObjects(apiResourceObjects, "types"),
        },
        {
            fieldType: "text" as "text",
            name: "search",
        },
        {
            fieldType: "price_range" as "price_range",
            name: "offer_price_usd",
        },
        {
            fieldType: "select" as "select",
            name: "exclude_refurbished",
            multiple: false,
            choices: [
                {
                    value: '0',
                    label: 'Ver todos'
                },
                {
                    value: '1',
                    label: 'Sólo equipos nuevos'
                }
            ],
        },
        {
            fieldType: "select" as "select",
            name: "exclude_marketplace",
            multiple: false,
            choices: [
                {
                    value: '0',
                    label: 'Ver todos'
                },
                {
                    value: '1',
                    label: 'Sólo de venta directa'
                }
            ],
        },
    ];

    const filterComponents: JSX.Element[] = [];

    categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
        const fieldFilters: JSX.Element[] = [];
        fieldset.filters.forEach((filter) => {
            let filterChoices =
                filter.choices === null
                    ? filter.choices
                    : filter.choices.map((c) => ({
                        label: c.name,
                        value: c.id,
                    }));

            if (filter.type === "exact") {
                filterChoices = filterChoices || [
                    {value: 0, label: "No"},
                    {value: 1, label: "Sí"},
                ];
            } else {
                filterChoices = filterChoices || [];
            }

            if (filter.type === "exact") {
                fieldsMetadata.push({
                    fieldType: "select" as "select",
                    name: filter.name,
                    multiple: Boolean(filter.choices),
                    choices: filterChoices,
                });
                fieldFilters.push(
                    <AccordionDetails key={filter.id}>
                        <ApiFormSelectComponent
                            name={filter.name}
                            label={filter.label}
                            exact
                        />
                    </AccordionDetails>
                );
            } else if (filter.type === "gte" || filter.type === "lte") {
                const fullName =
                    filter.type === "gte" ? `${filter.name}_min` : `${filter.name}_max`;
                fieldsMetadata.push({
                    fieldType: "select" as "select",
                    name: fullName,
                    multiple: false,
                    choices: filterChoices,
                });
                fieldFilters.push(
                    <AccordionDetails key={filter.id}>
                        <ApiFormSelectComponent name={fullName} label={filter.label}/>
                    </AccordionDetails>
                );
            } else if (filter.type === "range") {
                if (
                    filter.continuous_range_step !== null &&
                    filter.continuous_range_unit !== null
                ) {
                    fieldsMetadata.push({
                        fieldType: "slider" as "slider",
                        name: filter.name,
                        step: filter.continuous_range_step,
                        unit: filter.continuous_range_unit,
                        choices: [],
                    });
                } else {
                    fieldsMetadata.push({
                        fieldType: "slider" as "slider",
                        name: filter.name,
                        step: null,
                        unit: null,
                        choices: filterChoices.map((c) => ({...c, index: c.value})),
                    });
                }
                fieldFilters.push(
                    <AccordionDetails key={filter.id}>
                        <ApiFormSliderComponent name={filter.name} label={filter.label}/>
                    </AccordionDetails>
                );
            }
        });
        filterComponents.push(
            <Grid item xs={12} key={fieldset.label}>
                <Accordion>
                    <AccordionSummary
                        id={fieldset.label}
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="panel2a-content"
                    >
                        {fieldset.label}
                    </AccordionSummary>
                    {fieldFilters.map((f) => f)}
                </Accordion>
            </Grid>
        );
    });

    return (
        <Page title={`${category.name} | Navegar`}>
            <Container maxWidth={false}>
                <HeaderBreadcrumbs
                    heading=""
                    links={[
                        {name: "Inicio", href: PATH_DASHBOARD.root},
                        {name: "Categorías", href: PATH_CATEGORY.root},
                        {
                            name: `${category.name}`,
                            href: `${PATH_CATEGORY.root}/${category.id}`,
                        },
                        {name: "Navegar"},
                    ]}
                />
                <ApiFormComponent
                    fieldsMetadata={fieldsMetadata}
                    endpoint={`${category.url}browse/`}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={8}>
                            <Card>
                                <CardHeader title="Parámetros pricing"/>
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={{xs: 2, md: 3}}
                                        columns={{xs: 6, lg: 12}}
                                    >
                                        <Grid item xs={6}>
                                            <ApiFormSelectComponent name="stores" label="Retailers"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <ApiFormSelectComponent name="countries" label="Países"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <ApiFormSelectComponent name="types" label="Tipos"/>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <ApiFormSelectComponent
                                                name="exclude_refurbished"
                                                label="¿Mostrar reacondicionados?"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <ApiFormSelectComponent
                                                name="exclude_marketplace"
                                                label="¿Mostrar productos de marketplace?"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <Card style={{overflow: "visible"}}>
                                <CardHeader title="Filtros"/>
                                <CardContent>
                                    <Grid container spacing={{xs: 2, md: 3}}>
                                        <Grid item xs={12}>
                                            <ApiFormPriceRangeComponent
                                                name="offer_price_usd"
                                                label="Precio oferta"
                                                currencyUsed={
                                                    apiResourceObjects[
                                                        `${apiSettings.apiResourceEndpoints.currencies}1/`
                                                        ] as Currency
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ApiFormTextComponent
                                                name="search"
                                                label="Palabras clave"
                                            />
                                        </Grid>
                                        {filterComponents.map((f) => f)}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardHeader title="Resultados"/>
                                <CardContent>
                                    <ApiFormPaginationComponent/>
                                    <CategoryDetailBrowseTable
                                        columns={columns}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </ApiFormComponent>
            </Container>
        </Page>
    );
}

export const getServerSideProps = async (context: NextPageContext) => {
    const formLayout = await getCategorySpecsFromLayout(context, websiteId);
    const columns = await getCategoryColumns(context, 1)

    if (!formLayout || !columns) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            categorySpecsFormLayout: formLayout,
            columns: columns
        }
    }
};
