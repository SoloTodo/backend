import {Rating, RatingStatusDict} from "../frontend-utils/types/ratings";
import {MenuItem, Select} from "@mui/material";
import {useSnackbar} from "notistack";
import {jwtFetch} from "../frontend-utils/nextjs/utils";

type RatingStatusSelectorProps = {
    rating: Rating,
    setRating: (rating: Rating) => void
}

export default function RatingStatusSelector(props: RatingStatusSelectorProps) {
    const {rating, setRating} = props
    const {enqueueSnackbar} = useSnackbar();

    const handleChange = (newStatus:number) => {
        if (rating.status == newStatus) {
            return
        }

        enqueueSnackbar('Cambiando estado', {
            variant: 'info',
        });

        jwtFetch(null, `${rating.url}change_status/`, {
            method: 'post',
            body: JSON.stringify({status: newStatus}),
        }).then(res => {
            setRating(res)
            enqueueSnackbar('Estado actualizado', {
                variant: 'success'
            });
        });
    }

    return <Select
        value={rating.status}
        onChange={evt => handleChange(parseInt(evt.target.value as string))}
    >
        {Object.entries(RatingStatusDict).map(statusEntry => (
            <MenuItem key={statusEntry[0]} value={statusEntry[0]}>
                {statusEntry[1]}
            </MenuItem>
        ))}
    </Select>
}
