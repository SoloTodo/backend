import React, { useContext } from "react";
import { Autocomplete, TextField } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormSelect, ApiFormSelectChoice } from "./ApiFormSelect";

type ApiFormSelectComponentProps = {
  name: string;
  label: string;
};

export const choicesYesNo = [
  { label: "Si", value: 1 },
  { label: "No", value: 0 },
];

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

  let cleanedData: ApiFormSelectChoice | ApiFormSelectChoice[] | null | undefined = field.cleanedData;
  if (
    typeof field.cleanedData === "undefined" ||
    field.cleanedData.length === 0
  ) {
    if (field.multiple) {
      cleanedData = [];
    } else {
      cleanedData = null;
    }
  } else if (!field.multiple) {
    cleanedData = field.cleanedData[0];
  }
  return (
    <Autocomplete<ApiFormSelectChoice, boolean, boolean>
      multiple={field.multiple}
      options={field.choices}
      renderInput={(params) => <TextField {...params} label={props.label} />}
      filterSelectedOptions
      onChange={(_evt, newValues) => handleChange(newValues)}
      value={cleanedData}
      disableClearable={field.required}
      loading={context.isLoading}
      // getOptionLabel={(e) => e.label + e.value.toString()}
    />
  );
}
