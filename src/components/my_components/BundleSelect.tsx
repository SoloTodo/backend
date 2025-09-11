import {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useSnackbar} from "notistack";
import {jwtFetch} from "src/frontend-utils/nextjs/utils";
import {apiSettings} from "src/frontend-utils/settings";
import {useAppDispatch, useAppSelector} from "src/frontend-utils/redux/hooks";
import apiResourceObjectsSlice, {
    getApiResourceObjects,
    useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import {Bundle} from "src/frontend-utils/types/entity";

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

export default function BundleSelect({
                                         selectedBundle,
                                         setSelectedBundle,
                                     }: {
    selectedBundle: Bundle | null;
    setSelectedBundle: Function;
}) {
    const dispatch = useAppDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const apiResourceObjects = useAppSelector(useApiResourceObjects);

    const [bundleChoices, setBundleChoices] = useState<Bundle[]>([]);

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setName("");
        setOpen(false);
    };

    useEffect(() => {
        const bundles = getApiResourceObjects(apiResourceObjects, "bundles");
        if (bundles.length === 0) {
            jwtFetch(null, apiSettings.apiResourceEndpoints.bundles).then((data) => {
                dispatch(apiResourceObjectsSlice.actions.addApiResourceObjects(data));
                setBundleChoices(data);
            });
        } else {
            setBundleChoices(bundles);
        }
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmit = () => {
        if (name === "") {
            enqueueSnackbar("Debe ingresar un nombre para el bundle", {
                variant: "error",
            });
        } else {
            jwtFetch(null, apiSettings.apiResourceEndpoints.bundles, {
                method: "POST",
                body: JSON.stringify({name: name}),
            })
                .then((data) => {
                    dispatch(
                        apiResourceObjectsSlice.actions.addApiResourceObjects([data])
                    );
                    setBundleChoices([data, ...bundleChoices]);
                    setSelectedBundle(data);
                    handleClose();
                })
                .catch((err) => {
                    err
                        .json()
                        .then((errorJson: any) => {
                            enqueueSnackbar(errorJson.name[0], {variant: "error"});
                        })
                        .catch(() => {
                            enqueueSnackbar("Error desconocido al crear el bundle", {
                                variant: "error",
                            });
                        });
                });
        }
    };

    const handleSelectedBundleChange = (
        value: Bundle | null
    ) => {
        setSelectedBundle(value ? value : null);
    };

    return (
        <>
            <Typography>Bundle</Typography>
            <Stack spacing={2} direction="row">
                <Autocomplete
                    multiple={false}
                    options={bundleChoices}
                    renderInput={(params) => <TextField {...params} label=""/>}
                    getOptionLabel={(v) => v.name}
                    onChange={(_evt, newValues) => handleSelectedBundleChange(newValues)}
                    value={selectedBundle}
                    style={{width: "100%"}}
                />
                <Button variant="contained" onClick={handleOpen}>
                    Agregar
                </Button>
            </Stack>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Agregar bundle
                    </Typography>
                    <br/>
                    <TextField
                        id="name"
                        label="Nombre del bundle"
                        multiline
                        rows={1}
                        value={name}
                        onChange={handleChange}
                        style={{width: "100%"}}
                    />
                    <br/>
                    <br/>
                    <Button variant="contained" color="success" onClick={handleSubmit}>
                        Crear
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
