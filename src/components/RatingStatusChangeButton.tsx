import {Rating} from "../frontend-utils/types/ratings";
import {Button,} from "@mui/material";
import {jwtFetch} from "../frontend-utils/nextjs/utils";

type RatingStatusChangeButtonProps = {
    rating: Rating,
    status: Number,
    label: String,
    onSuccess: () => {}
}

export default function RatingStatusChangeButton(props: RatingStatusChangeButtonProps) {
    const {rating, status, onSuccess, label} = props

    const handleClick = () => {
        jwtFetch(null, `${rating.url}change_status/`, {
            method: 'post',
            body: JSON.stringify({status: status}),
        }).then(res => {
            onSuccess()
        });
    }

    return <Button
        variant="contained"
        onClick={handleClick}
      >
        {label}
      </Button>
}
