import { useContext } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormRangePicker } from "./ApiFormRangePicker";
import { Stack, TextField } from "@mui/material";
import { isValid, set } from "date-fns";

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
    if (newValue !== null && isValid(newValue)) {
      newValue = set(newValue, { hours: 0, minutes: 0, seconds: 0 });
      if (position === 0) {
        context.updateUrl({ [`${name}_after`]: [newValue.toISOString()] });
      } else if (position === 1) {
        context.updateUrl({ [`${name}_before`]: [newValue.toISOString()] });
      }
    } else {
      if (position === 0) {
        context.updateUrl({ [`${name}_after`]: [] });
      } else {
        context.updateUrl({ [`${name}_before`]: [] });
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={1} direction="row">
        <DesktopDatePicker
          label={`${label} desde`}
          value={cleanedData[0]}
          maxDate={cleanedData[1] || new Date()}
          inputFormat="dd/MM/yyyy"
          onChange={(newValue) => handleChange(newValue, 0)}
          renderInput={(params) => <TextField {...params} />}
        />
        <DesktopDatePicker
          label="hasta"
          value={cleanedData[1]}
          minDate={cleanedData[0]}
          maxDate={new Date()}
          inputFormat="dd/MM/yyyy"
          onChange={(newValue) => handleChange(newValue, 1)}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
}
