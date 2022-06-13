import {
  Box,
  Slider,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { SyntheticEvent, useContext, useEffect, useState } from "react";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormSlider, ApiFormSliderChoice } from "./ApiFormSlider";

const Loading = (label: string, loading: boolean) => {
  return (
    <Stack direction="column">
      <Typography>{label}</Typography>
      <div style={{ textAlign: "center" }}>
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <Typography variant="caption">Sin opciones</Typography>
        )}
      </div>
    </Stack>
  );
};

export default function ApiFormSliderComponent({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormSlider | undefined;
  const [cleanedData, setCleanedData] = useState<(number | null)[]>([0, 0]);

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  useEffect(() => {
    if (typeof field.cleanedData !== "undefined")
      setCleanedData(field.cleanedData);
  }, [field.cleanedData]);

  if (
    context.currentResult === null ||
    typeof field.cleanedData === "undefined"
  ) {
    return Loading(label, true);
  }

  let choices: ApiFormSliderChoice[] = [];
  let aggsValues: { id: number; doc_count: number }[] = [];
  if (field.step === null) {
    let aggsCount = 0;
    aggsValues = context.currentResult.aggs[field.name];
    choices = field.choices.map((c, idx) => {
      const doc = aggsValues.filter((a) => a.id == c.value);
      if (doc.length !== 0) aggsCount += doc[0].doc_count;
      return {
        index: idx,
        value: c.value,
        label: c.label,
        count: aggsCount,
      };
    });
  } else {
    let lowLimit = 0;
    let limit = 0;
    const step = Number(field.step);

    aggsValues = context.currentResult.aggs[field.name].sort(
      (a: { id: number }, b: { id: number }) => a.id - b.id
    );
    if (aggsValues.length !== 0) {
      limit = Math.round(aggsValues[aggsValues.length - 1].id / step);
      lowLimit = Math.round(aggsValues[0].id / step);
    }

    for (let i = lowLimit; i <= limit; i++) {
      const docCount = aggsValues.filter((a) => a.id <= step * i);
      const count =
        docCount.length !== 0
          ? docCount.reduce(
              (acc: number, a: { doc_count: number }) => acc + a.doc_count,
              0
            )
          : 0;
      choices.push({
        index: step * i,
        value: step * i,
        label: (step * i).toString(),
        count: count,
      });
    }
  }

  if (choices.length === 0) {
    return Loading(label, false);
  }

  const minChoice = choices[0];
  const maxChoice = choices[choices.length - 1];

  const handleChange = (_event: Event, newValue: number | number[]) => {
    // if (Array.isArray(newValue)) setCleanedData([
    //   choices.filter((c) => c.value === newValue[0])[0].
    // ]);
  };

  const handleChangeSubmit = (
    _event: Event | SyntheticEvent<Element, Event>,
    _newValue: number | number[]
  ) => {
    // const newStart = choices.filter((c) => c.value === cleanedData[0]);
    // const newEnd = choices.filter((c) => c.value === cleanedData[1]);
    // if (newStart.length === 0 || newEnd.length === 0) return;
    // const newIdStart = newStart[0].index;
    // const newIdEnd = newEnd[0].index;
    // if (
    //   newIdStart === field.cleanedData![0] &&
    //   newIdEnd === field.cleanedData![1]
    // )
    //   return;
    // let minValue: string[] = [];
    // let maxValue: string[] = [];
    // if (minChoice.index !== newIdStart) {
    //   minValue = [newIdStart.toString()];
    // }
    // if (maxChoice.index !== newIdEnd) {
    //   maxValue = [newIdEnd.toString()];
    // }
    // context.updateUrl({
    //   [`${name}_min`]: minValue,
    //   [`${name}_max`]: maxValue,
    // });
  };

  const valueLabelFormat = (value: number) => {
    const unit = field.unit !== null ? field.unit : "";
    let sup = choices.filter((choice) => choice.value === cleanedData[1]);
    if (sup.length === 0) sup = [maxChoice];
    let inf = choices.filter((choice) => choice.value === cleanedData[0]);
    if (inf.length === 0) sup = [minChoice];

    if (sup.length !== 0 && inf.length !== 0) {
      const docCountDif = Number(sup[0].count) - Number(inf[0].count);
      return `${inf[0].label} - ${sup[0].label} ${unit} (${docCountDif} resultados)`;
    } else {
      return value;
    }
  };

  let sliderValues = [0, 0];
  if (field.step === null) {
    sliderValues = [
      field.cleanedData[0] !== null
        ? choices.filter((c) => c.value === field.cleanedData![0])[0].index
        : minChoice.index,
      field.cleanedData[1] !== null
        ? choices.filter((c) => c.value === field.cleanedData![1])[0].index
        : maxChoice.index,
    ];
  } else {
    sliderValues = [
      field.cleanedData[0] !== null ? field.cleanedData[0] : minChoice.index,
      field.cleanedData[1] !== null ? field.cleanedData[1] : maxChoice.index,
    ];
  }

  return (
    <Stack direction="column">
      <Typography>{label}</Typography>
      <Box sx={{ width: "100%" }}>
        <Slider
          value={sliderValues}
          marks={
            field.step === null
              ? choices.map((c) => ({ label: c.label, value: c.index }))
              : []
          }
          valueLabelDisplay={"auto"}
          step={Number(field.step)}
          max={choices[choices.length - 1].index}
          min={choices[0].index}
          onChange={handleChange}
          onChangeCommitted={handleChangeSubmit}
          valueLabelFormat={valueLabelFormat}
          disableSwap
        />
      </Box>
    </Stack>
  );
}
