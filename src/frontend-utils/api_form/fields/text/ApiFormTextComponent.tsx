import { TextField } from "@mui/material";
import { HTMLInputTypeAttribute, useContext, useState } from "react";
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

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const data =
    typeof field.cleanedData !== "undefined" ? field.cleanedData : "";
  const [value, setValue] = useState<string>(data);

  const handleChange = () => {
    if (value === "" || value === null) {
      context.updateUrl({ [name]: [] });
    } else {
      context.updateUrl({ [name]: [value] });
    }
  };

  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      style={{ width: "100%" }}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleChange()}
      onBlur={handleChange}
      type={inputType}
    />
  );
}
