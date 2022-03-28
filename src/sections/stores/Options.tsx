import * as React from "react";
import NextLink from "next/link";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";
import { PATH_STORE } from "src/routes/paths";
import { useRouter } from "next/router";

type Option = {
  key: number;
  text: string;
  path: string;
};

export default function CustomizedTables() {
  const router = useRouter();
  const baseRoute = `${PATH_STORE.root}/${router.query.id}`
  const options: Option[] = [
    {
      key: 1,
      text: "Información general",
      path: baseRoute,
    },
    {
      key: 2,
      text: "Actualizar pricing",
      path: `${baseRoute}/update_pricing`,
    },
    {
      key: 3,
      text: "Registros de actualización",
      path: `${baseRoute}/update_logs`,
    },
    {
      key: 4,
      text: "Leads (listado)",
      path: `${baseRoute}`,
    },
    {
      key: 5,
      text: "Leads (estadísticas)",
      path: `${baseRoute}`,
    },
    {
      key: 6,
      text: "Entidades en conflicto",
      path: `${baseRoute}`,
    },
    {
      key: 7,
      text: "Ratings",
      path: `${baseRoute}`,
    },
    {
      key: 8,
      text: "Descargar reporte de homologación",
      path: `${baseRoute}`,
    },
  ];
  return (
    <Card style={{ padding: 10 }}>
      <CardHeader title="Opciones" sx={{ mb: 3 }} />
      <List>
        {options.map((o) => (
          <ListItem key={o.key}>
            <ListItemText
              primary={
                <NextLink href={o.path} passHref>
                  <Link>{o.text}</Link>
                </NextLink>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
