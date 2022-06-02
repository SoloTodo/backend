import { Box, Slider, Stack, Typography } from "@mui/material";
import { SetStateAction, SyntheticEvent, useContext, useState } from "react";
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

  let choices: ApiFormSliderChoice[] = [];
  if (field.discrete) {
    choices = field.choices.map((c, index) => ({
      label: c.label,
      id: c.value,
      value: index,
    }));
  } else {
    let limit = 31;
    let aggsValues = [];
    const step = field.step !== null ? field.step : 100;
    if (context.currentResult !== null) {
      aggsValues = context.currentResult.aggs[field.name].sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );
      if (aggsValues.length !== 0)
        limit = Math.round(aggsValues[aggsValues.length - 1].id / step);
    }
    for (let i = 0; i <= limit; i++) {
      const doc_count = aggsValues.filter(
        (a: { id: number }) => a.id <= step * i
      );
      const count =
        doc_count.length !== 0
          ? doc_count.reduce(
              (acc: number, a: { doc_count: number }) => acc + a.doc_count,
              0
            )
          : 0;
      choices.push({
        label: `${step * i}${field.unit} (${count})`,
        value: step * i,
        id: step * i,
      });
    }
  }
  const defaultChoice = { value: 0, id: 0, label: "" };
  const minChoice = choices.length !== 0 ? choices[0] : defaultChoice;
  const maxChoice =
    choices.length !== 0 ? choices[choices.length - 1] : defaultChoice;

  const valueLabelFormat = (value: number) => {
    return choices.length !== 0
      ? choices.filter((c) => c.value === value)[0].label
      : "";
  };

  const minSelectedChoice =
    typeof field.cleanedData !== "undefined" && field.cleanedData[0] !== null
      ? choices.filter((c) => c.id === field.cleanedData![0])
      : [];
  const maxSelectedChoice =
    typeof field.cleanedData !== "undefined" && field.cleanedData[1] !== null
      ? choices.filter((c) => c.id === field.cleanedData![1])
      : [];
  const minSelected =
    minSelectedChoice.length !== 0
      ? minSelectedChoice[0].value
      : minChoice.value;
  const maxSelected =
    maxSelectedChoice.length !== 0
      ? maxSelectedChoice[0].value
      : maxChoice.value;

  const [cleanedData, setCleanedData] = useState<number | number[]>([minSelected, maxSelected]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setCleanedData(newValue);
  }

  const handleChangeSubmit = (
    _event: Event | SyntheticEvent<Element, Event>,
    _newValue: number | number[]
  ) => {
    if (Array.isArray(cleanedData)) {
      const newIdStart = choices.filter((c) => c.value === cleanedData[0])[0].id;
      const newIdEnd = choices.filter((c) => c.value === cleanedData[1])[0].id;

      if (newIdStart !== minSelected || newIdEnd !== maxSelected) {
        if (minChoice.id === newIdStart || typeof newIdStart === "undefined") {
          context.updateUrl({ [`${name}_min`]: [] });
        } else {
          context.updateUrl({ [`${name}_min`]: [newIdStart.toString()] });
        }
        if (maxChoice.id === newIdEnd || typeof newIdEnd === "undefined") {
          context.updateUrl({ [`${name}_max`]: [] });
        } else {
          context.updateUrl({ [`${name}_max`]: [newIdEnd.toString()] });
        }
      }
    }
  };

  return (
    <Stack direction="column">
      <Typography>{label}</Typography>
      <Box sx={{ width: "100%" }}>
        <Slider
          value={cleanedData}
          marks={field.discrete ? choices : []}
          valueLabelDisplay={"auto"}
          step={field.step}
          max={choices.length !== 0 ? choices[choices.length - 1].value : 100}
          min={choices.length !== 0 ? choices[0].value : 0}
          onChange={handleChange}
          onChangeCommitted={handleChangeSubmit}
          valueLabelFormat={valueLabelFormat}
          disableSwap
        />
      </Box>
    </Stack>
  );
}
