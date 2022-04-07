import { TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import ApiFormContext from "../../ApiFormContext";
import { ApiFormText } from "./ApiFormText";

export default function ApiFormTextComponent({ name }: { name: string }) {
  const context = useContext(ApiFormContext);
  const field = context.getField(name) as ApiFormText | undefined;
  const [value, setValue] = useState("");
  const [first, setFirst] = useState(true);

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }

  const handleChange = () => {
    if (value === "") {
      context.updateUrl({ [name]: [] });
    } else {
      context.updateUrl({ [name]: [value] });
    }
  };

  useEffect(() => {
    if (typeof field.cleanedData !== "undefined" && first) {
      setValue(field.cleanedData);
      setFirst(false);
    }
  });

  return (
    <TextField
      id="outlined-basic"
      label={field.label}
      variant="outlined"
      style={{ width: "100%" }}
      value={value}
      onChange={(evt) => setValue(evt.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleChange()}
      onBlur={handleChange}
    />
  );
}
