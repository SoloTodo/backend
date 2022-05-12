import LoadingButton from '@mui/lab/LoadingButton';
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormSubmit } from './ApiFormSubmit';

export default function ApiFormSubmitComponent({ name }: { name: string }) {
  const context = useContext(ApiFormContext);

  const field = context.getField(name) as ApiFormSubmit | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: ${name}`;
  }
  // let params = {}
  // fields.map((field) => {
  //   const apiField = context.getField(field)
  //   if (typeof apiField !== "undefined") {
  //     const apiParamsByField = apiField.getApiParams() as ApiFormApiParams
  //     params = Object.assign({}, params, apiParamsByField);
  //   }
  // })

  // console.log(params)
  // console.log(context.currentResult)

  const handleSubmit = () => {
    context.updateUrl({ [name]: ['true'] });
  };

  return (
    <LoadingButton variant="contained" onClick={handleSubmit} loading={field.cleanedData}>
      Generar
    </LoadingButton>
  );
}
