import {Entity, EntitySecInfo} from "../../frontend-utils/types/entity";
import {useEffect, useState} from "react";
import {jwtFetch} from "../../frontend-utils/nextjs/utils";
import {Link, Typography} from "@mui/material";
import styles from './EntitySecInfoComponent.module.css'

export default function EntitySecInfoComponent({entity}: { entity: Entity }) {
    const [sec_data, set_sec_data] = useState<EntitySecInfo[]>([])
    useEffect(() => {
        jwtFetch(null, `${entity.url}sec_info/`)
            .then(sec_data => {
                set_sec_data(sec_data)
            })
    }, [entity]);

    if (!sec_data.length) {
        return null
    }

    return <>
        <Typography variant="h6">Información SEC</Typography>

        {sec_data.map(sec_entry =>
            <dl className={styles.list} key={sec_entry.code}>
                <li className={styles.list_item}><strong>Código: </strong> {sec_entry.code}</li>
                <li className={styles.list_item}><strong>URL: </strong> <Link href={sec_entry.sec_url} target="_blank">{sec_entry.sec_url}</Link>
                </li>
                <li className={styles.list_item}><strong>Marcas: </strong> {sec_entry.brands}</li>
                <li className={styles.list_item}><strong>Modelos: </strong> {sec_entry.models}</li>
            </dl>
        )}
    </>
}
