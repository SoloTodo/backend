import React, { useContext } from "react";
import { Autocomplete, TextField } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormSelect, ApiFormSelectChoice } from "./ApiFormSelect";

type ApiFormSelectComponentProps = {
  name: string;
};

export default function ApiFormSelectComponent(
  props: ApiFormSelectComponentProps
) {
  const context = useContext(ApiFormContext);
  const field = context.getField(props.name) as ApiFormSelect | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${props.name}`;
  }

  const handleChange = (
    selected: ApiFormSelectChoice | ApiFormSelectChoice[] | null
  ) => {
    if (selected === null) {
      context.updateUrl({ [props.name]: [] });
      return;
    }

    if ("length" in selected) {
      const newValues = selected.map((option) => option.value.toString());
      context.updateUrl({ [props.name]: newValues });
      return;
    } else {
      context.updateUrl({ [props.name]: [selected.value.toString()] });
    }
  };

  return (
    <Autocomplete
      multiple={field.multiple}
      options={field.choices}
      renderInput={(params) => (
        <TextField {...params} label={field.label} />
      )}
      filterSelectedOptions
      onChange={(_evt, newValues) => handleChange(newValues)}
      value={field.cleanedData}
      isOptionEqualToValue={(o, v) => o.value === v.value}
      disableClearable={field.required}
    />
  );
}
