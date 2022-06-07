import React, { useContext } from "react";
import { Autocomplete, TextField } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormSelect, ApiFormSelectChoice } from "./ApiFormSelect";

type ApiFormSelectComponentProps = {
  name: string;
  label: string;
};

type DocCount = {
  id: string | number;
  doc_count: number;
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

  let cleanedData:
    | ApiFormSelectChoice
    | ApiFormSelectChoice[]
    | null
    | undefined = field.cleanedData;
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

  let choices = field.choices;
  let strictName = field.name.replace("_min", "").replace("_max", "");
  if (
    context.currentResult !== null &&
    typeof context.currentResult.aggs !== "undefined" &&
    typeof context.currentResult.aggs[strictName] !== "undefined"
  ) {
    let docCountTotal = context.currentResult.aggs[strictName].reduce(
      (acc: number, a: DocCount) => (acc += a.doc_count),
      0
    );
    choices = field.choices.reduce(
      (acc: { value: string | number; label: string }[], a) => {
        const choiceWithDoc = context.currentResult.aggs[strictName].filter(
          (c: DocCount) => c.id === a.value
        );
        if (choiceWithDoc.length > 0) {
          acc.push({
            value: a.value,
            label: `${a.label} (${docCountTotal})`,
          });
          docCountTotal -= choiceWithDoc[0].doc_count;
        }
        return acc;
      },
      []
    );
    if (
      cleanedData !== null &&
      typeof cleanedData !== "undefined" &&
      choices.length !== 0
    ) {
      if (Array.isArray(cleanedData)) {
        cleanedData = cleanedData.reduce((acc: ApiFormSelectChoice[], c) => {
          const ch = choices.filter((choice) => c.value === choice.value);
          if (ch.length !== 0)
            acc.push({
              value: c.value,
              label: ch[0].label,
            });
          return acc;
        }, []);
      } else {
        const actualValue = cleanedData.value;
        const ch = choices.filter((choice) => actualValue === choice.value);
        if (ch.length !== 0) {
          cleanedData = {
            value: actualValue,
            label: ch[0].label,
          };
        } else {
          cleanedData = null;
        }
      }
    }
  }

  const isOptionEqualToValue = (
    option: ApiFormSelectChoice,
    value: ApiFormSelectChoice
  ) => {
    return option.value === value.value;
  };

  return (
    <Autocomplete<ApiFormSelectChoice, boolean, boolean>
      multiple={field.multiple}
      options={choices}
      renderInput={(params) => <TextField {...params} label={props.label} />}
      filterSelectedOptions
      onChange={(_evt, newValues) => handleChange(newValues)}
      value={cleanedData}
      disableClearable={field.required}
      loading={context.isLoading}
      isOptionEqualToValue={isOptionEqualToValue}
    />
  );
}
