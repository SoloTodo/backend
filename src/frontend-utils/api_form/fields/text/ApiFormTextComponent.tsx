import { TextField } from "@mui/material";
import { HTMLInputTypeAttribute, useContext, useEffect, useState } from "react";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormText } from "./ApiFormText";

export default function ApiFormTextComponent({
  name,
  label,
  inputType,
}: {
  name: string;
  label: string;
  inputType?: HTMLInputTypeAttribute;
}) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormText | undefined;
  const [value, setValue] = useState<string>("");

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  useEffect(() => {
    if (typeof field.cleanedData !== "undefined") {
      setValue(field.cleanedData);
    }
  }, [field.cleanedData]);

  const onChange = (value: string) => {
    setValue(value);
  }

  const handleChange = () => {
    if (value !== field.cleanedData) {
      if (value === "" || value === null) {
        context.updateUrl({ [name]: [] });
      } else {
        context.updateUrl({ [name]: [value] });
      }
    }
  };

  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      style={{ width: "100%" }}
      value={value}
      onChange={(evt) => onChange(evt.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleChange()}
      onBlur={handleChange}
      type={inputType}
    />
  );
}
