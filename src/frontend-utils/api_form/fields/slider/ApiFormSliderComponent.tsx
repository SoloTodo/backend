import {
  Box,
  Slider,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { SyntheticEvent, useContext, useState } from "react";
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
  const [cleanedData, setCleanedData] = useState<number | number[]>([0, 0]);
  const [first, setFirst] = useState(true);

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

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
    const step = Number(field.step);

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

  if (choices.length === 0) {
    return Loading(label, false);
  }

  const minChoice = choices[0];
  const maxChoice = choices[choices.length - 1];

  if (first) {
    if (field.step === null) {
      setCleanedData([
        field.cleanedData[0] !== null
          ? choices.filter((c) => c.id === field.cleanedData![0])[0].value
          : minChoice.value,
        field.cleanedData[1] !== null
          ? choices.filter((c) => c.id === field.cleanedData![1])[0].value
          : maxChoice.value,
      ]);
    } else {
      setCleanedData([
        field.cleanedData[0] !== null ? field.cleanedData[0] : minChoice.value,
        field.cleanedData[1] !== null ? field.cleanedData[1] : maxChoice.value,
      ]);
    }
    setFirst(false);
  }

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

        if (
          newIdStart !== field.cleanedData![0] ||
          newIdEnd !== field.cleanedData![1]
        ) {
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
          marks={field.step === null ? choices : []}
          valueLabelDisplay={"auto"}
          step={Number(field.step)}
          max={choices[choices.length - 1].value}
          min={choices[0].value}
          onChange={handleChange}
          onChangeCommitted={handleChangeSubmit}
          valueLabelFormat={valueLabelFormat}
          disableSwap
        />
      </Box>
    </Stack>
  );
}
