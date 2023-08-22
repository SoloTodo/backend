import NextLink from "next/link";
import {Button, Link, Typography} from "@mui/material";
import ApiFormPaginationTable
    from "src/components/api_form/ApiFormPaginationTable";
import {
    useApiResourceObjects
} from "src/frontend-utils/redux/api_resources/apiResources";
import {PATH_PRODUCT, PATH_RATING, PATH_STORE} from "src/routes/paths";
import {useAppSelector} from "src/frontend-utils/redux/hooks";
import {useContext} from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import {jwtFetch} from "src/frontend-utils/nextjs/utils";
import {fDateTimeSuffix} from "src/utils/formatTime";
import {Rating} from "src/frontend-utils/types/ratings";
import {useUser} from "src/frontend-utils/redux/user";
import {useSnackbar} from "notistack";
import RatingStatusChangeButton
    from "../../components/RatingStatusChangeButton";

export default function PendingRatingssTable() {
    const {enqueueSnackbar} = useSnackbar();
    const apiResourceObjects = useAppSelector(useApiResourceObjects);
    const user = useAppSelector(useUser);
    const context = useContext(ApiFormContext);

    const handleRatingChange = (rating:Rating) => {
        context.setCurrentResult({
            ...context.currentResult,
            count: context.currentResult.count - 1,
            results: context.currentResult.results.filter(
                (e: Rating) => e.url !== rating.url
            ),
        });
        enqueueSnackbar("Rating actualizado");
    };

    const columns: any[] = [
        {
            headerName: "ID",
            field: "id",
            flex: 1,
            renderCell: (row: Rating) => (
                <NextLink href={`${PATH_RATING.root}/${row.id}`} passHref>
                    <Link>{row.id}</Link>
                </NextLink>
            ),
        },
        {
            headerName: "Fecha creación",
            field: "creation_date",
            renderCell: (row: Rating) => fDateTimeSuffix(row.creation_date),
            flex: 1,
        },
        {
            headerName: "Producto",
            field: "producto",
            flex: 1,
            renderCell: (row: Rating) => (
                <NextLink href={`${PATH_PRODUCT.root}/${row.product.id}`}
                          passHref>
                    <Link>{row.product.name}</Link>
                </NextLink>
            ),
        },
        {
            headerName: "Rating producto",
            field: "product_rating",
            renderCell: (row: Rating) => (
                row.product_rating || <em>N/A</em>
            ),
            flex: 1,
        },
        {
            headerName: "Comentarios producto",
            field: "product_comments",
            renderCell: (row: Rating) => (
                row.product_comments || <em>N/A</em>
            ),
            flex: 1,
        },
        {
            headerName: "Tienda",
            field: "store",
            flex: 1,
            renderCell: (row: Rating) => (
                <NextLink
                    href={`${PATH_STORE.root}/${apiResourceObjects[row.store].id}`}
                    passHref
                >
                    <Link>{apiResourceObjects[row.store].name}</Link>
                </NextLink>
            ),
        },
        {
            headerName: "Rating tienda",
            field: "store_rating",
            flex: 1,
        },
        {
            headerName: "Comentarios tienda",
            field: "store_comments",
            flex: 1,
        },
        {
            headerName: "Prueba de compra",
            field: "purchase_proof",
            flex: 1,
            renderCell: (row: Rating) => (
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={row.purchase_proof}
                >
                    Descargar
                </Link>
            ),
        },
    ];

    if (user && user.permissions.includes("solotodo.is_ratings_staff")) {
        columns.push(
            {
                headerName: "IP",
                field: "ip",
                flex: 1,
                renderCell: (row: Rating) =>
                    row.ip.length <= 15 ? (
                        <Typography>{row.ip}</Typography>
                    ) : (
                        <Typography>{row.ip.substring(0, 12)}...</Typography>
                    ),
            },
            {
                headerName: "Contacto",
                field: "email_or_phone",
                flex: 1,
                renderCell: (row: Rating) => row.email_or_phone ||
                    <em>N/A</em>,
            },
            {
                headerName: "Aprobar",
                field: "approve",
                flex: 1,
                renderCell: (row: Rating) => (
                    <RatingStatusChangeButton
                        rating={row}
                        status={2}
                        onSuccess={() => handleRatingChange(row)}
                        label='Aprobar'/>
                )
            },
            {
                headerName: "Rechazar",
                field: "delete",
                flex: 1,
                renderCell: (row: Rating) => (
                    <RatingStatusChangeButton
                        rating={row}
                        status={3}
                        onSuccess={() => handleRatingChange(row)}
                        label='Rechazar'/>
                ),
            },
            {
                headerName: "Investigar",
                field: "investigate",
                flex: 1,
                renderCell: (row: Rating) => (
                    <RatingStatusChangeButton
                        rating={row}
                        status={4}
                        onSuccess={() => handleRatingChange(row)}
                        label='Investigar'/>
                ),
            }
        );
    }

    return <ApiFormPaginationTable columns={columns} title="Ratings"/>;
}
