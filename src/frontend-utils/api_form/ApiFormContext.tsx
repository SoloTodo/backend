import React, { ReactNode } from "react";
import { ApiForm, ApiFormField } from "./ApiForm";

const ApiFormContext = React.createContext({
  getField: (name: string) => undefined as ApiFormField | undefined,
  updateUrl: (newUrlParams: Record<string, string[]>, paginationChange?: boolean) => {},
  currentResult: undefined as any,
  setCurrentResult: (newCurrentResult: any) => {},
});

type ApiFormProviderProps = {
  children: ReactNode;
  form: ApiForm;
  updateUrl: (newUrlParams: Record<string, string[]>) => void;
  currentResult: any;
  setCurrentResult: React.Dispatch<any>
};

export const ApiFormProvider = ({
  children,
  form,
  updateUrl,
  currentResult,
  setCurrentResult
}: ApiFormProviderProps) => {
  const getField = (name: string) => form.getField(name);

  return (
    <ApiFormContext.Provider
      value={{
        getField: getField,
        updateUrl: updateUrl,
        currentResult: currentResult,
        setCurrentResult: setCurrentResult
      }}
    >
      {children}
    </ApiFormContext.Provider>
  );
};

export default ApiFormContext;
