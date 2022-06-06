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
  const [first, setFirst] = useState(true);
  const [value, setValue] = useState<string>("");

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  // const data =
  // typeof field.cleanedData !== "undefined" ? field.cleanedData : "";

  useEffect(() => {
    if (typeof field.cleanedData !== "undefined" && first) {
      setValue(field.cleanedData);
      setFirst(false);
    }
  });

  const handleChange = (newValue: string | null) => {
    console.log(newValue)
    console.log(value)
    if (newValue !== value) {
      if (value === "" || value === null) {
        context.updateUrl({ [name]: [] });
      } else {
        context.updateUrl({ [name]: [value] });
      }
    }
  };

  // TODO: check actualización de search una sola vez
  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      style={{ width: "100%" }}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleChange(null)}
      onBlur={(e) => handleChange(e.target.value)}
      type={inputType}
    />
  );
}
