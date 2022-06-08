import { Box, Slider, Stack, Typography } from "@mui/material";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
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
  let aggsValues: { id: number; doc_count: number }[] = [];
  if (context.currentResult !== null) {
    if (field.discrete) {
      let aggsCount = 0;
      aggsValues = context.currentResult.aggs[field.name];
      choices = field.choices.map((c, index) => {
        const doc = aggsValues.filter((a) => a.id == c.value);
        if (doc.length !== 0) aggsCount += doc[0].doc_count;
        return {
          label: c.label,
          id: c.value,
          value: index,
          count: aggsCount,
        };
      });
    } else {
      let lowLimit = 0;
      let limit = 0;
      const step = field.step !== null ? field.step : 1;

      aggsValues = context.currentResult.aggs[field.name].sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id
      );
      if (aggsValues.length !== 0) {
        limit = Math.round(aggsValues[aggsValues.length - 1].id / step);
        lowLimit = Math.round(aggsValues[0].id / step);
      }

      for (let i = lowLimit; i <= limit; i++) {
        const doc_count = aggsValues.filter((a) => a.id <= step * i);
        const count =
          doc_count.length !== 0
            ? doc_count.reduce(
                (acc: number, a: { doc_count: number }) => acc + a.doc_count,
                0
              )
            : 0;
        choices.push({
          count: count,
          label: (step * i).toString(),
          value: step * i,
          id: step * i,
        });
      }
    }
  }

  const defaultChoice = { value: 0, id: 0, label: "" };
  const minChoice = choices.length !== 0 ? choices[0] : defaultChoice;
  const maxChoice =
    choices.length !== 0 ? choices[choices.length - 1] : defaultChoice;

  const minSelectedChoice =
    typeof field.cleanedData !== "undefined" && field.cleanedData[0] !== null
      ? choices.filter((c) => c.id === field.cleanedData![0])
      : [];
  const maxSelectedChoice =
    typeof field.cleanedData !== "undefined" && field.cleanedData[1] !== null
      ? choices.filter((c) => c.id === field.cleanedData![1])
      : [];
  const minSelected =
    minSelectedChoice.length !== 0 ? minSelectedChoice[0] : minChoice;
  const maxSelected =
    maxSelectedChoice.length !== 0 ? maxSelectedChoice[0] : maxChoice;

  const [cleanedData, setCleanedData] = useState<number | number[]>([
    minSelected.value,
    maxSelected.value,
  ]);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    if (typeof field.cleanedData !== "undefined" && first) {
      setCleanedData([minSelected.value, maxSelected.value]);
      setFirst(false);
    }
  });

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setCleanedData(newValue);
  };

  const handleChangeSubmit = (
    _event: Event | SyntheticEvent<Element, Event>,
    _newValue: number | number[]
  ) => {
    if (Array.isArray(cleanedData)) {
      const newStart = choices.filter((c) => c.value === cleanedData[0]);
      const newEnd = choices.filter((c) => c.value === cleanedData[1]);

      if (newStart.length !== 0 && newEnd.length !== 0) {
        const newIdStart = newStart[0].id;
        const newIdEnd = newEnd[0].id;

        if (newIdStart !== minSelected.id || newIdEnd !== maxSelected.id) {
          let minValue: string[] = [];
          let maxValue: string[] = [];
          if (
            minChoice.id !== newIdStart &&
            typeof newIdStart !== "undefined"
          ) {
            minValue = [newIdStart.toString()];
          }
          if (maxChoice.id !== newIdEnd && typeof newIdEnd !== "undefined") {
            maxValue = [newIdEnd.toString()];
          }
          context.updateUrl({
            [`${name}_min`]: minValue,
            [`${name}_max`]: maxValue,
          });
        }
      }
    }
  };

  const valueLabelFormat = (value: number) => {
    const unit = field.unit !== null ? field.unit : "";
    if (typeof cleanedData !== "number") {
      const sup = choices.filter((choice) => choice.value === cleanedData[1]);
      const inf = choices.filter((choice) => choice.value === cleanedData[0]);
      if (sup.length !== 0 && inf.length !== 0) {
        const docCountDif = Number(sup[0].count) - Number(inf[0].count);
        return `${inf[0].label} - ${sup[0].label} ${unit} (${docCountDif} resultados)`;
      } else {
        return value;
      }
    } else {
      return `${cleanedData} ${unit}`;
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
