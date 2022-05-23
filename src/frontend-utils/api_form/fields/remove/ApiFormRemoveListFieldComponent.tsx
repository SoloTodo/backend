import { useContext } from "react";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormRemoveListField } from "./ApiFormRemoveListField";
import { Chip, Stack, Typography } from "@mui/material";

export default function ApiFormRemoveListFieldComponent({
  name,
}: {
  name: string;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormRemoveListField | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const handleItemRemove = (item: string) => {
    if (typeof field.cleanedData !== "undefined") {
      const newCleanedData = field.cleanedData.filter((c) => c !== item);
      context.updateUrl({ [name]: newCleanedData });
    }
  };

  return (
    <Stack spacing={1}>
      <Typography>{field.label}</Typography>
      <Stack spacing={1} direction="row">
        {field.cleanedData?.map((c) => (
          <Chip
            key={c}
            label={c}
            onDelete={() => handleItemRemove(c)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
