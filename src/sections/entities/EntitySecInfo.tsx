import {Entity, EntitySecInfo} from "../../frontend-utils/types/entity";
import {useEffect, useState} from "react";
import {jwtFetch} from "../../frontend-utils/nextjs/utils";
import {Link, Typography} from "@mui/material";

export default function EntitySecInfoComponent({entity}: { entity: Entity }) {
    const [sec_data, set_sec_data] = useState<EntitySecInfo[] | null>(null)
    useEffect(() => {
        jwtFetch(null, `${entity.url}sec_info/`)
            .then(sec_data => {
                set_sec_data(sec_data)
            })
    }, [entity]);

    if (!sec_data) {
        return null
    }

    return <>
        <Typography variant="h6">Información SEC</Typography>

        {sec_data.map(sec_entry =>
            <dl style={{marginTop: '10px'}}>
                <li><strong>Código: </strong> {sec_entry.code}</li>
                <li><strong>URL: </strong> <Link href={sec_entry.sec_url} target="_blank">{sec_entry.sec_url}</Link>
                </li>
                <li><strong>Marcas: </strong> {sec_entry.brands}</li>
                <li><strong>Modelos: </strong> {sec_entry.models}</li>
            </dl>
        )}
    </>
}
