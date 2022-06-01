import { Box, Slider, Stack, Typography } from "@mui/material";
import { SyntheticEvent, useContext } from "react";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormSlider, ApiFormSliderChoice } from "./ApiFormSlider";

export default function ApiFormSliderComponent({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormSlider | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  if (!field.discrete) return null;

  console.log(field.choices);
  let choices: ApiFormSliderChoice[] = [];
  if (field.discrete) {
    choices = field.choices.map((c, index) => ({
      label: c.label,
      id: c.value,
      value: index,
    }))
  } else {
    for (let i = 0; i < 30; i++) {
      const step = field.step !== null ? field.step * i : i;
      choices.push({
        value: step * i,
        label: `${step}${field.unit}`,
        id: step * i,
      })
    }
  }
  console.log(choices);
  const defaultChoice = { value: 0, id: 0, label: "" };
  const minChoice = choices.length !== 0 ? choices[0] : defaultChoice;
  const maxChoice =
    choices.length !== 0 ? choices[choices.length - 1] : defaultChoice;

  const valueLabelFormat = (value: number) => {
    return choices.length !== 0
      ? choices.filter((c) => c.value === value)[0].label
      : "";
  };

  const handleChange = (
    event: Event | SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => {
    console.log(newValue);
    if (Array.isArray(newValue)) {
      const newIdStart = choices.filter((c) => c.value === newValue[0])[0].id;
      const newIdEnd = choices.filter((c) => c.value === newValue[1])[0].id;

      if (minChoice.id === newIdStart || typeof newIdStart === "undefined") {
        context.updateUrl({ [`${name}_start`]: [] });
      } else {
        context.updateUrl({ [`${name}_start`]: [newIdStart.toString()] });
      }
      if (maxChoice.id === newIdEnd || typeof newIdEnd === "undefined") {
        context.updateUrl({ [`${name}_end`]: [] });
      } else {
        context.updateUrl({ [`${name}_end`]: [newIdEnd.toString()] });
      }
    }
  };

  console.log(field.name);
  console.log(field.cleanedData);
  const cleanedData = [
    typeof field.cleanedData !== "undefined" && field.cleanedData[0] !== null
      ? choices.filter((c) => c.id === field.cleanedData![0])[0].value
      : minChoice.value,
    typeof field.cleanedData !== "undefined" && field.cleanedData[1] !== null
      ? choices.filter((c) => c.id === field.cleanedData![1])[0].value
      : maxChoice.value,
  ];

  console.log(cleanedData);

  return (
    <Stack direction="column">
      <Typography>{label}</Typography>
      <Box sx={{ width: "100%" }}>
        <Slider
          value={cleanedData}
          marks={choices}
          valueLabelDisplay={"on"}
          step={field.step}
          max={choices.length !== 0 ? choices[choices.length - 1].value : 100}
          min={choices.length !== 0 ? choices[0].value : 0}
          onChangeCommitted={handleChange}
          valueLabelFormat={valueLabelFormat}
          disableSwap
        />
      </Box>
    </Stack>
  );
}
