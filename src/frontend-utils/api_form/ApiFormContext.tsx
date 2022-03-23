import React, { ReactNode } from "react";
import { ApiForm, ApiFormField } from "./ApiForm";

const ApiFormContext = React.createContext({
  getField: (name: string) => undefined as ApiFormField | undefined,
  updateUrl: (newUrlParams: Record<string, string[]>) => {},
  currentResult: undefined as any,
});

type ApiFormProviderProps = {
  children: ReactNode;
  form: ApiForm;
  updateUrl: (newUrlParams: Record<string, string[]>) => void;
  currentResult: any;
};

export const ApiFormProvider = ({
  children,
  form,
  updateUrl,
  currentResult,
}: ApiFormProviderProps) => {
  const getField = (name: string) => form.getField(name);

  return (
    <ApiFormContext.Provider
      value={{
        getField: getField,
        updateUrl: updateUrl,
        currentResult: currentResult,
      }}
    >
      {children}
    </ApiFormContext.Provider>
  );
};

export default ApiFormContext;
