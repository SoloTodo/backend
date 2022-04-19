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

export default function CustomizedTables({
  options,
  defaultKey = "key",
}: {
  options: Option[];
  defaultKey?: string;
}) {
  return (
    <Card>
      <CardHeader title="Opciones" />
      <CardContent>
        <List>
          {options.map((o) =>
            typeof o.hasPermission === "undefined" || o.hasPermission ? (
              <ListItem key={o[defaultKey as keyof Option]}>
                <ListItemText
                  primary={
                    o.renderObject ? (
                      o.renderObject
                    ) : (
                      <NextLink href={o.path} passHref>
                        <Link>{o.text}</Link>
                      </NextLink>
                    )
                  }
                />
              </ListItem>
            ) : null
          )}
        </List>
      </CardContent>
    </Card>
  );
}
