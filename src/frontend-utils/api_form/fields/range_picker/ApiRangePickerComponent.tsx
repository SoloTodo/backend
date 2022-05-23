import { useContext, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormRangePicker } from "./ApiRangePicker";
import { Stack, TextField } from "@mui/material";

export default function ApiFormRangePickerComponent({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormRangePicker | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const cleanedData =
    typeof field.cleanedData !== "undefined" ? field.cleanedData : [null, null];

  const handleChange = (newValue: Date | null, position: number) => {
    if (newValue !== null) {
      console.log(newValue);

      context.updateUrl({ [name]: [newValue.toISOString()] });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={1} direction="row">
        <DesktopDatePicker
          label={`${label} desde`}
          value={cleanedData[0]}
          inputFormat="dd/MM/yyyy"
          onChange={(newValue) => handleChange(newValue, 0)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DesktopDatePicker
          label="hasta"
          value={cleanedData[1]}
          inputFormat="dd/MM/yyyy"
          onChange={(newValue) => handleChange(newValue, 1)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
