import { useContext, useEffect, useState } from "react";
import { DesktopDatePicker } from "@mui/lab";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { TextField } from "@mui/material";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormDatePicker } from "./ApiDatePicker";

export default function ApiFormDatePickerComponent({ name }: { name: string }) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormDatePicker | undefined;
  const [value, setValue] = useState<Date | null>(null);
  const [first, setFirst] = useState(true);

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const handleChange = (newValue: Date | null) => {
    if (newValue !== value) {
      setValue(newValue);
      if (newValue?.toString() !== "Invalid Date") {
        if (newValue === null) {
          context.updateUrl({ [name]: [] });
        } else {
          context.updateUrl({ [name]: [newValue.toISOString()] });
        }
      }
    }
  };

  useEffect(() => {
    if (
      typeof field.cleanedData !== "undefined" &&
      field.cleanedData !== null &&
      first
    ) {
      setValue(field.cleanedData);
      setFirst(false);
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={field.label}
        inputFormat="dd/MM/yyyy"
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
