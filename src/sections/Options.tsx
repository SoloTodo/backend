import * as React from "react";
import NextLink from "next/link";
import {
  Card,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Link,
  CardContent,
} from "@mui/material";
import { Option } from "src/frontend-utils/types/extras";

export default function CustomizedTables({ options }: { options: Option[] }) {
  return (
    <Card>
      <CardHeader title="Opciones" />
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
