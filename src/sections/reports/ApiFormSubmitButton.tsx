import { Button } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormApiParams } from "src/frontend-utils/api_form/types";

export default function ApiFormSubmitButton({ fields }: { fields: string[] }) {
  const context = useContext(ApiFormContext);

  // let params = {}
  // fields.map((field) => {
  //   const apiField = context.getField(field)
  //   if (typeof apiField !== "undefined") {
  //     const apiParamsByField = apiField.getApiParams() as ApiFormApiParams
  //     params = Object.assign({}, params, apiParamsByField);
  //   }
  // })

  // console.log(params)

  const handleSubmit = () => {};

  return (
    <Button variant="contained" onClick={handleSubmit}>
      Generar
    </Button>
  );
}
